package project.back_end.mapper;

import org.mapstruct.Mapper;
import project.back_end.entity.OrderDeliveryAddress;
import project.back_end.response.DeliveryAddressResponse;

@Mapper(componentModel = "spring")
public interface DeliveryAddressResponseMapper {
    DeliveryAddressResponse toResponse(OrderDeliveryAddress address);
}
