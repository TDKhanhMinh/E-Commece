package project.back_end.mapper;

import org.mapstruct.*;
import project.back_end.dto.product.OptionDto;
import project.back_end.dto.product.SkuDto;
import project.back_end.dto.product.SpecDto;
import project.back_end.entity.product.Product;
import project.back_end.entity.product.ProductAttributeValue;
import project.back_end.entity.product.Sku;
import project.back_end.entity.product.SkuAttributeValue;
import project.back_end.request.Product.ProductRequest;
import project.back_end.response.Product.ProductDetailResponse;
import project.back_end.response.Product.ProductListResponse;

import java.util.*;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProductMapper {

    /* ========================================================================
       1. ENTITY TO RESPONSE (DETAIL)
       ======================================================================== */

    @Mapping(target = "specifications", source = "specs")
    @Mapping(target = "variants", source = "skus")
    @Mapping(target = "configurableOptions", source = "skus", qualifiedByName = "extractOptions")
    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "brandId", source = "brand.id")
    @Mapping(target = "images", source = "images")
    ProductDetailResponse toDetailResponse(Product product);

    @Mapping(target = "attributeName", source = "attribute.name")
    @Mapping(source = "attribute.id", target = "attributeId")
    SpecDto toSpecDto(ProductAttributeValue entity);

    @Mapping(target = "skuCode", source = "code")
    @Mapping(target = "price", source = "price")
    @Mapping(target = "stock", source = "stock")
    @Mapping(target = "isActive", source = "isActive")
    @Mapping(target = "salePrice", source = "salePrice")
    @Mapping(target = "finalPrice", expression = "java(sku.getFinalPrice())")
    @Mapping(target = "discountPercent", source = "discountPercent")
    @Mapping(target = "image", expression = "java(getFirstImage(sku))")
    @Mapping(target = "imagesDetails", source = "images")
    @Mapping(target = "attributes", source = "attributeValues", qualifiedByName = "mapSkuAttributes")
    SkuDto toSkuDto(Sku sku);

    /* ========================================================================
       2. ENTITY TO RESPONSE (LIST)
       ======================================================================== */

    @Mapping(target = "brandName", source = "brand.name")
    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "minPrice", expression = "java(calculateMinPrice(product))")
    @Mapping(target = "image", expression = "java(getThumbnail(product))")
    ProductListResponse toListResponse(Product product);

    /* ========================================================================
       3. REQUEST TO ENTITY (UPDATE)
       ======================================================================== */

    @Mapping(target = "category", ignore = true)
    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "specs", ignore = true)
    void updateProductFromRequest(ProductRequest request, @MappingTarget Product product);

    /* ========================================================================
       HELPER METHODS (LOGIC XỬ LÝ PHỤ)
       ======================================================================== */

    // Lấy ảnh đầu tiên của SKU
    default String getFirstImage(Sku sku) {
        return (sku.getImages() != null && !sku.getImages().isEmpty())
                ? sku.getImages().get(0) : "https://png.pngtree.com/png-clipart/20220719/original/pngtree-new-product-in-banner-style-png-image_8366873.png";
    }

    // Lấy ảnh đại diện cho danh sách sản phẩm (Ưu tiên: Product images > SKU images > Default)
    default String getThumbnail(Product product) {
        String defaultImage = "https://png.pngtree.com/png-clipart/20220719/original/pngtree-new-product-in-banner-style-png-image_8366873.png";

        // Ưu tiên 1: Ảnh từ Product
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            return product.getImages().get(0);
        }

        // Ưu tiên 2: Ảnh từ SKU đầu tiên
        if (product.getSkus() == null || product.getSkus().isEmpty()) {
            return defaultImage;
        }
        return getFirstImage(product.getSkus().get(0));
    }

    // Tính giá thấp nhất từ danh sách SKU bằng Stream API
    default Double calculateMinPrice(Product product) {
        if (product.getSkus() == null || product.getSkus().isEmpty()) return 0.0;
        return product.getSkus().stream()
                .map(sku -> sku.getPrice().doubleValue())
                .min(Double::compare)
                .orElse(0.0);
    }

    // Chuyển đổi List Attribute sang Map Code-Value
    @Named("mapSkuAttributes")
    default Map<String, String> mapSkuAttributes(List<SkuAttributeValue> values) {
        if (values == null) return Collections.emptyMap();
        return values.stream().collect(Collectors.toMap(
                val -> val.getAttribute().getCode(),
                SkuAttributeValue::getValue,
                (existing, replacement) -> existing // Tránh lỗi duplicate key
        ));
    }

    // Logic quan trọng: Trích xuất các tùy chọn (Size, Color...) từ danh sách SKU
    @Named("extractOptions")
    default List<OptionDto> extractOptions(List<Sku> skus) {
        if (skus == null) return Collections.emptyList();

        Map<String, OptionDto> optionsMap = new LinkedHashMap<>();
        for (Sku sku : skus) {
            for (SkuAttributeValue val : sku.getAttributeValues()) {
                String code = val.getAttribute().getCode();
                optionsMap.computeIfAbsent(code, k -> {
                    OptionDto dto = new OptionDto();
                    dto.setCode(code);
                    dto.setName(val.getAttribute().getName());
                    dto.setValues(new HashSet<>());
                    return dto;
                }).getValues().add(val.getValue());
            }
        }
        return new ArrayList<>(optionsMap.values());
    }
}