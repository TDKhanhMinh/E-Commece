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
    OrderResponse toOrderResponse(Order order);
}
