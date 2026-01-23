package project.back_end.mapper;

import org.mapstruct.Mapper;
import project.back_end.entity.DeliveryAddress;
import project.back_end.response.UserResponse.DeliveryAddressResponse;

@Mapper(componentModel = "spring")
public interface AddressMapper {
    DeliveryAddressResponse toDeliveryAddressResponse(DeliveryAddress deliveryAddress);
}
