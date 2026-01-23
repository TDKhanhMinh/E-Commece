package project.back_end.service.UserService;

import org.springframework.stereotype.Service;
import project.back_end.request.UserRequest.AddressRequest;
import project.back_end.response.UserResponse.DeliveryAddressResponse;

import java.util.List;

@Service
public interface DeliveryAddressService {
    List<DeliveryAddressResponse> getUserDeliveryAddresses(String email);

    DeliveryAddressResponse updateUserDeliveryAddress(Long id, AddressRequest addressRequest);

    Boolean deleteUserDeliveryAddress(Long id);

    DeliveryAddressResponse addUserDeliveryAddress(String email, AddressRequest addressRequest);

}
