package project.back_end.request.CartRequest;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class CartItemRequest {

    private Long skuId;

    @Min(1)
    private Integer quantity;
}

