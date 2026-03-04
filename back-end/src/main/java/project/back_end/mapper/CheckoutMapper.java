package project.back_end.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import project.back_end.entity.Order;
import project.back_end.response.OrderResponse;

@Mapper(
        componentModel = "spring",
        uses = {
                OrderItemMapper.class,
                DeliveryAddressResponseMapper.class
        }
)

public interface CheckoutMapper {

    @Mapping(source = "id", target = "orderId")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "deliveryAddress", target = "deliveryAddress")
    @Mapping(source = "orderItems", target = "items")
    @Mapping(source = "createdAt", target = "createdAt")
    @Mapping(source = "updatedAt", target = "updatedAt")
    @Mapping(source = "cancelledAt", target = "cancelledAt")
    @Mapping(source = "confirmedAt", target = "confirmedAt")
    @Mapping(source = "deliveredAt", target = "deliveredAt")
    @Mapping(source = "paymentMethod", target = "paymentMethod")
    @Mapping(source = "shippingMethod", target = "shippingMethod")
    @Mapping(source = "totalAmount", target = "totalAmount")
    @Mapping(source = "totalDiscount", target = "totalDiscount")
    @Mapping(source = "finalAmount", target = "finalAmount")
    @Mapping(source = "shippingCost", target = "shippingCost")
    OrderResponse toOrderResponse(Order order);
}
