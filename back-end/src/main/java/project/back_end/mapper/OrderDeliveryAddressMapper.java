package project.back_end.mapper;


import org.mapstruct.Mapper;
import project.back_end.entity.DeliveryAddress;
import project.back_end.entity.OrderDeliveryAddress;

@Mapper(componentModel = "spring")
public interface OrderDeliveryAddressMapper {

    OrderDeliveryAddress toEntity(DeliveryAddress deliveryAddress);
}

