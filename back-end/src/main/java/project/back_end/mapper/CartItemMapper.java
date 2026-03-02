package project.back_end.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import project.back_end.entity.CartItem;
import project.back_end.entity.product.Sku;
import project.back_end.entity.product.SkuAttributeValue;
import project.back_end.response.CartItemResponse;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface CartItemMapper {

    @Mapping(target = "skuId", source = "sku.id")
    @Mapping(target = "skuCode", source = "sku.code")

    @Mapping(target = "productId", source = "sku.product.id")
    @Mapping(target = "productName", source = "sku.product.name")
    @Mapping(target = "productSlug", source = "sku.product.slug")

    @Mapping(
            target = "attributes",
            source = "sku.attributeValues",
            qualifiedByName = "mapSkuAttributes"
    )

    @Mapping(target = "price", source = "sku.price")
    @Mapping(
            target = "salePrice",
            expression = "java(calcSalePrice(cartItem.getSku()))"
    )
    @Mapping(
            target = "discountPercent",
            expression = "java(calcDiscountPercent(cartItem.getSku()))"
    )

    @Mapping(target = "stock", source = "sku.stock")
    @Mapping(target = "quantity", source = "quantity")

    @Mapping(
            target = "image",
            expression = "java(getSkuImage(cartItem.getSku()))"
    )
    CartItemResponse toResponse(CartItem cartItem);

    /* ================= HELPER METHODS ================= */

    @Named("mapSkuAttributes")
    default Map<String, String> mapSkuAttributes(
            List<SkuAttributeValue> values
    ) {
        if (values == null) return Map.of();

        return values.stream()
                .collect(Collectors.toMap(
                        v -> v.getAttribute().getCode(),
                        v -> v.getValue()
                ));
    }

    default BigDecimal calcSalePrice(Sku sku) {
        if (sku.getDiscountPercent() == null ||
                sku.getDiscountPercent() <= 0) {
            return sku.getPrice();
        }

        return sku.getPrice()
                .multiply(BigDecimal.valueOf(100 - sku.getDiscountPercent()))
                .divide(BigDecimal.valueOf(100));
    }

    default Integer calcDiscountPercent(Sku sku) {
        return sku.getDiscountPercent();
    }

    default String getSkuImage(Sku sku) {
        if (sku.getImages() != null && !sku.getImages().isEmpty()) {
            return sku.getImages().get(0);
        }
        return "https://th.bing.com/th/id/R.5fa32d0f91bb6befd88027725b4f2e0d?rik=6PlumKuW4AsJxQ&pid=ImgRaw&r=0";
    }
}
