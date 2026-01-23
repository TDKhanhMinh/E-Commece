package project.back_end.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import project.back_end.entity.DeliveryAddress;
import project.back_end.entity.User;
import project.back_end.mapper.AddressMapper;
import project.back_end.repository.DeliveryAddressRepository;
import project.back_end.repository.UserRepository;
import project.back_end.request.UserRequest.AddressRequest;
import project.back_end.response.UserResponse.DeliveryAddressResponse;
import project.back_end.service.UserService.DeliveryAddressService;
import project.back_end.service.UserService.UserService;

import java.util.List;
import java.util.Optional;

@Service
public class DeliveryAddressServiceImpl implements DeliveryAddressService {
    private static final Logger log = LoggerFactory.getLogger(DeliveryAddressServiceImpl.class);
    private final UserRepository userRepository;
    private final DeliveryAddressRepository deliveryAddressRepository;
    private final AddressMapper addressMapper;

    public DeliveryAddressServiceImpl(UserService userService, UserRepository userRepository, DeliveryAddressRepository deliveryAddressRepository, AddressMapper addressMapper) {
        this.userRepository = userRepository;
        this.deliveryAddressRepository = deliveryAddressRepository;
        this.addressMapper = addressMapper;
    }

    @Override
    public List<DeliveryAddressResponse> getUserDeliveryAddresses(String email) {
        User user = userRepository.getUserByEmail(email);
        List<DeliveryAddress> addresses = deliveryAddressRepository.findByUserId(user.getId());
        return addresses.stream()
                .map(addressMapper::toDeliveryAddressResponse)
                .toList();
    }

    @Override
    public DeliveryAddressResponse updateUserDeliveryAddress(Long id, AddressRequest addressRequest) {
        return null;
    }

    @Override
    public Boolean deleteUserDeliveryAddress(Long id) {
        Optional<DeliveryAddress> address = deliveryAddressRepository.findById(id);
        if (address.isEmpty()) {
            return false;
        }
        deliveryAddressRepository.deleteById(id);
        return true;
    }

    @Override
    public DeliveryAddressResponse addUserDeliveryAddress(String email, AddressRequest addressRequest) {
        User user = userRepository.getUserByEmail(email);
        log.error("User address found: {}", addressRequest);
        DeliveryAddress newAddress = new DeliveryAddress();
        newAddress.setUser(user);
        newAddress.setUserName(addressRequest.getUserName());
        newAddress.setLocation(addressRequest.getLocation());
        newAddress.setPhoneNumber(addressRequest.getPhoneNumber());
        newAddress.setIsDefault(addressRequest.getIsDefault());
        deliveryAddressRepository.save(newAddress);
        return addressMapper.toDeliveryAddressResponse(newAddress);
    }
}
