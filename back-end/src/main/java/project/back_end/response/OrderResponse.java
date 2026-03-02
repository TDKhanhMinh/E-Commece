package project.back_end.response;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import project.back_end.entity.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class OrderResponse {

    private Long orderId;
    private OrderStatus status;

    private Long totalAmount;
    private Long totalDiscount;
    private Long finalAmount;

    private DeliveryAddressResponse deliveryAddress;
    private List<CheckoutItemResponse> items;

    private LocalDateTime createdAt;
}

