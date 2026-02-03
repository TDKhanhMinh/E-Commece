package project.back_end.service.impl;

import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.back_end.entity.product.*;
import project.back_end.exception.AppException;
import project.back_end.exception.ErrorCode;
import project.back_end.mapper.ProductMapper;
import project.back_end.repository.AttributeRepository;
import project.back_end.repository.BrandRepository;
import project.back_end.repository.CategoryRepository;
import project.back_end.repository.ProductRepository;
import project.back_end.request.Product.ProductRequest;
import project.back_end.request.Product.SpecRequest;
import project.back_end.response.Product.ProductDetailResponse;
import project.back_end.response.Product.ProductListResponse;
import project.back_end.service.ProductService;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Locale;
import java.util.Optional;
import java.util.regex.Pattern;


@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final AttributeRepository attributeRepository;
    private final ProductMapper productMapper;

    @Override
    @Transactional
    public ProductDetailResponse createProduct(ProductRequest request) {
        Product product = new Product();
        mapRequestToEntity(request, product);


        product.setSlug(toSlug(request.getName()));

        Product savedProduct = productRepository.save(product);
        return productMapper.toDetailResponse(savedProduct);
    }

    @Override
    @Transactional
    public ProductDetailResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        mapRequestToEntity(request, product);

        product.setSlug(toSlug(request.getName()));

        Product savedProduct = productRepository.save(product);
        return productMapper.toDetailResponse(savedProduct);
    }

    @Override
    public ProductDetailResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        return productMapper.toDetailResponse(product);
    }

    @Override
    public Page<ProductListResponse> getAllProducts(String keyword, Long categoryId, Long brandId, Pageable pageable) {
        Page<Product> products = productRepository.searchProducts(keyword, categoryId, brandId, pageable);

        return products.map(this::mapToListResponse);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
        }
        productRepository.deleteById(id);
    }

    // ================= HELPER METHODS =================

    private void mapRequestToEntity(ProductRequest request, Product product) {
        product.setName(request.getName());
        product.setDescription(request.getDescription());

        // Gán Category
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        product.setCategory(category);

        // Gán Brand
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));
        product.setBrand(brand);

        // Xử lý Specs (Xóa cũ thêm mới để update list)
        if (product.getSpecs() != null) {
            product.getSpecs().clear();
        } else {
            product.setSpecs(new ArrayList<>());
        }

        if (request.getSpecs() != null) {
            for (SpecRequest specReq : request.getSpecs()) {
                Attribute attribute = attributeRepository.findById(specReq.getAttributeId())
                        .orElseThrow(() -> new AppException(ErrorCode.ATTRIBUTE_NOT_FOUND));

                ProductAttributeValue val = new ProductAttributeValue();
                val.setProduct(product);
                val.setAttribute(attribute);
                val.setValue(specReq.getValue());
                product.getSpecs().add(val);
            }
        }
    }

    private ProductListResponse mapToListResponse(Product product) {
        ProductListResponse res = new ProductListResponse();

        // Thông tin cơ bản
        res.setId(product.getId());
        res.setName(product.getName());
        res.setSlug(product.getSlug());
        res.setBrandName(product.getBrand().getName());
        res.setCategoryName(product.getCategory().getName());

        // Xử lý SKU và giá
        if (product.getSkus() != null && !product.getSkus().isEmpty()) {
            // Lấy giá min và max từ list SKU
            double minPrice = product.getSkus().stream()
                    .mapToDouble(sku -> sku.getPrice().doubleValue())
                    .min()
                    .orElse(0.0);

            double maxPrice = product.getSkus().stream()
                    .mapToDouble(sku -> sku.getPrice().doubleValue())
                    .max()
                    .orElse(0.0);

            res.setMinPrice(minPrice);
            res.setMaxPrice(maxPrice);

            // Số lượng biến thể
            res.setVariantCount(product.getSkus().size());

            // Kiểm tra tồn kho (có ít nhất 1 SKU còn hàng)
            boolean inStock = product.getSkus().stream()
                    .anyMatch(sku -> sku.getStock() != null && sku.getStock() > 0);
            res.setInStock(inStock);

            // Lấy hình ảnh đại diện từ SKU đầu tiên
            String defaultImage = "https://th.bing.com/th/id/R.5fa32d0f91bb6befd88027725b4f2e0d?rik=6PlumKuW4AsJxQ&pid=ImgRaw&r=0";
            String imageUrl = Optional.ofNullable(product.getSkus())
                    .filter(skus -> !skus.isEmpty())
                    .map(skus -> skus.get(0))
                    .map(Sku::getImages)
                    .filter(images -> !images.isEmpty())
                    .map(images -> images.get(0))
                    .orElse(defaultImage);
            res.setImage(imageUrl);
        } else {
            // Không có SKU
            res.setMinPrice(0.0);
            res.setMaxPrice(0.0);
            res.setVariantCount(0);
            res.setInStock(false);
            res.setImage("https://th.bing.com/th/id/R.5fa32d0f91bb6befd88027725b4f2e0d?rik=6PlumKuW4AsJxQ&pid=ImgRaw&r=0");
        }

        // Tính discount percent (nếu có sự chênh lệch giá)
        if (res.getMaxPrice() != null && res.getMinPrice() != null &&
                res.getMaxPrice() > res.getMinPrice() && res.getMaxPrice() > 0) {
            int discountPercent = (int) (((res.getMaxPrice() - res.getMinPrice()) / res.getMaxPrice()) * 100);
            res.setDiscountPercent(discountPercent);
        } else {
            res.setDiscountPercent(0);
        }

        // TODO: Tích hợp rating và reviewCount từ hệ thống đánh giá khi có
        // Tạm thời set giá trị mặc định
        res.setRating(0.0);
        res.setReviewCount(0);

        return res;
    }


    // Slug generator
    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    private String toSlug(String input) {
        return getString(input, WHITESPACE, NONLATIN);
    }

    @NonNull
    static String getString(String input, Pattern whitespace, Pattern nonlatin) {
        if (input == null) return "";
        String nowhitespace = whitespace.matcher(input).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = nonlatin.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH);
    }
}