package project.back_end.response.Product;

import lombok.Data;

@Data
public class ProductListResponse {
    private Long id;
    private String name;
    private String slug;
    private String image;

    // Giá
    private Double minPrice;
    private Double maxPrice;
    private Integer discountPercent;

    // Trạng thái
    private Boolean inStock;
    private Integer variantCount;

    // Thông tin phụ
    private String brandName;
    private String categoryName;

    // Social proof
    private Double rating;
    private Integer reviewCount;
}
