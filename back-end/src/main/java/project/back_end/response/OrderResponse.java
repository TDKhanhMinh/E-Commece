package project.back_end.response;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import project.back_end.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class OrderResponse {

    private Long orderId;
    private OrderStatus status;

    private BigDecimal totalAmount;
    private BigDecimal totalDiscount;
    private BigDecimal finalAmount;

    private DeliveryAddressResponse deliveryAddress;
    private List<CheckoutItemResponse> items;

    private String shippingMethod;
    private String paymentMethod;
    private BigDecimal shippingCost;

    private LocalDateTime createdAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime cancelledAt;
    private LocalDateTime confirmedAt;
    private LocalDateTime updatedAt;


}

