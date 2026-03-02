package project.back_end.mapper;


import org.mapstruct.Mapper;
import project.back_end.entity.OrderItem;
import project.back_end.response.CheckoutItemResponse;

@Mapper(componentModel = "spring")
public interface OrderItemMapper {

    CheckoutItemResponse toCheckoutItemResponse(OrderItem orderItem);
}

