package project.back_end.request;


import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CheckoutRequest {

    @NotEmpty(message = "Danh sách sản phẩm không được rỗng")
    private List<CheckoutItemRequest> items;

    @NotNull(message = "Địa chỉ giao hàng không được rỗng")
    private Long deliveryAddressId;

    private String paymentMethod;

    private String shippingMethod;

    private String voucherCode;

    private Double pointsUsed;
}

