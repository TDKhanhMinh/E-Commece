package project.back_end.response;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CheckoutItemResponse {

    private Long skuId;
    private String productName;

    private Long price;       // giá gốc
    private Long salePrice;   // giá sau giảm (nếu có)

    private Integer quantity;
    private Long totalPrice;
}
