package project.back_end.response;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Map;

@Data
public class CartItemResponse {

    private Long skuId;
    private String skuCode;

    private Long productId;
    private String productName;
    private String productSlug;

    private Map<String, String> attributes;

    private BigDecimal price;        // từ SKU
    private BigDecimal salePrice;    // từ SKU
    private Integer discountPercent;

    private Integer stock;
    private Integer quantity;

    private String image;
}
