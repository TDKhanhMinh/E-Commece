package project.back_end.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.back_end.entity.DeliveryAddress;
import project.back_end.entity.User;
import project.back_end.exception.AppException;
import project.back_end.exception.ErrorCode;
import project.back_end.mapper.AddressMapper;
import project.back_end.repository.DeliveryAddressRepository;
import project.back_end.repository.UserRepository;
import project.back_end.request.UserRequest.AddressRequest;
import project.back_end.response.UserResponse.DeliveryAddressResponse;
import project.back_end.service.DeliveryAddressService;

import java.util.List;
import java.util.Optional;

@Service
public class DeliveryAddressServiceImpl implements DeliveryAddressService {
    private static final Logger log = LoggerFactory.getLogger(DeliveryAddressServiceImpl.class);
    private final UserRepository userRepository;
    private final DeliveryAddressRepository deliveryAddressRepository;
    private final AddressMapper addressMapper;

    public DeliveryAddressServiceImpl(UserRepository userRepository, DeliveryAddressRepository deliveryAddressRepository, AddressMapper addressMapper) {
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
    @Transactional
    public DeliveryAddressResponse updateUserDeliveryAddress(Long addressId, String userName, AddressRequest request) {

        User currentUser = userRepository.findByEmail(userName)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        DeliveryAddress existingAddress = deliveryAddressRepository.findById(addressId)
                .orElseThrow(() -> new AppException(ErrorCode.DELIVERY_ADDRESS_NOT_FOUND));

        if (!existingAddress.getUser().getId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if (Boolean.TRUE.equals(request.getIsDefault())) {
            Optional<DeliveryAddress> oldDefault = deliveryAddressRepository
                    .findByUserAndIsDefaultTrue(currentUser);

            if (oldDefault.isPresent()) {
                oldDefault.get().setIsDefault(false);
                deliveryAddressRepository.save(oldDefault.get());
            }
            existingAddress.setIsDefault(true);
        } else if (request.getIsDefault() != null) {
            existingAddress.setIsDefault(false);
        }

        if (request.getUserName() != null && !request.getUserName().isBlank()) {
            existingAddress.setUserName(request.getUserName());
        }
        if (request.getLocation() != null && !request.getLocation().isBlank()) {
            existingAddress.setLocation(request.getLocation());
        }
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().isBlank()) {
            existingAddress.setPhoneNumber(request.getPhoneNumber());
        }

        DeliveryAddress savedAddress = deliveryAddressRepository.save(existingAddress);
        return addressMapper.toDeliveryAddressResponse(savedAddress);
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
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        DeliveryAddress existingDefaultAddress = deliveryAddressRepository
                .findByUserAndIsDefaultTrue(user)
                .orElse(null);
        DeliveryAddress newAddress = new DeliveryAddress();
        newAddress.setUser(user);
        newAddress.setUserName(addressRequest.getUserName());
        newAddress.setLocation(addressRequest.getLocation());
        newAddress.setPhoneNumber(addressRequest.getPhoneNumber());
        newAddress.setIsDefault(addressRequest.getIsDefault());
        if (Boolean.TRUE.equals(addressRequest.getIsDefault()) && existingDefaultAddress != null) {
            existingDefaultAddress.setIsDefault(false);
            deliveryAddressRepository.save(existingDefaultAddress);
        } else if (existingDefaultAddress == null) {
            newAddress.setIsDefault(true);
        }

        deliveryAddressRepository.save(newAddress);
        return addressMapper.toDeliveryAddressResponse(newAddress);
    }
}
