package project.back_end.response.Product;

import lombok.Data;

@Data
public class ProductListResponse {
    private Long id;
    private String name;
    private String slug;
    private String image;
    private Double minPrice;
    private String brandName;
    private String categoryName;
}