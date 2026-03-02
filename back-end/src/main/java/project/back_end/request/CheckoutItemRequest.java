package project.back_end.request;


import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CheckoutItemRequest {

    @NotNull
    private Long skuId;

    @Min(value = 1, message = "Số lượng phải >= 1")
    private Integer quantity;
}
