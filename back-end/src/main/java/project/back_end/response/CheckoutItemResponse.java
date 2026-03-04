package project.back_end.response;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class CheckoutItemResponse {
    private Long skuId;
    private String productName;
    private String skuCode;
    private String image;
    private BigDecimal price;
    private BigDecimal salePrice;
    private Integer quantity;
    private BigDecimal totalPrice;
}
