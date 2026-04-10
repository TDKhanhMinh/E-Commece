package project.back_end.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.back_end.entity.Delivery;
import project.back_end.entity.Order;
import project.back_end.entity.ShipperProfile;
import project.back_end.entity.User;
import project.back_end.enumerate.DeliveryStatus;
import project.back_end.enumerate.ErrorCode;
import project.back_end.enumerate.OrderStatus;
import project.back_end.exception.AppException;
import project.back_end.mapper.DeliveryMapper;
import project.back_end.repository.DeliveryRepository;
import project.back_end.repository.OrderRepository;
import project.back_end.repository.ShipperProfileRepository;
import project.back_end.repository.UserRepository;
import project.back_end.response.AdminDeliveryResponse;
import project.back_end.response.ShipperDeliveryResponse;
import project.back_end.service.DeliveryService;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class DeliveryServiceImpl implements DeliveryService {
    private final DeliveryRepository deliveryRepository;
    private final DeliveryMapper deliveryMapper;
    private final ShipperProfileRepository shipperProfileRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final NotificationServiceImpl notificationService;

    @Override
    public void createDeliveryForOrder(Order order) {
        Delivery delivery = new Delivery();
        delivery.setOrder(order);
        delivery.setShipper(null);
        delivery.setStatus(DeliveryStatus.PENDING);
        delivery.setAmountToCollect(order.getFinalAmount());
        order.setDelivery(delivery);
        deliveryRepository.save(delivery);
        // Gửi thông báo đến tất cả shipper về đơn hàng mới
        List<User> shippers = userRepository.getAllByRole(User.Role.SHIPPER);
        for (User shipper : shippers) {
            if (shipper.getDeviceToken() != null) {
                log.error("Gửi thông báo đến shipper); email: {}, deviceToken: {}", shipper.getEmail(), shipper.getDeviceToken());
                notificationService.sendNotification(
                        shipper.getDeviceToken(),
                        "Đơn hàng mới",
                        "Có đơn hàng mới. Vui lòng kiểm tra!"
                );
            }
        }
    }

    @Override
    public void updateDeliveryStatus(Long deliveryId, String status) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new AppException(ErrorCode.DELIVERY_NOT_FOUND));
        DeliveryStatus newStatus = parseStatus(status);
        switch (newStatus) {
            case PICKED_UP:
                if (delivery.getStatus() != DeliveryStatus.PENDING) {
                    throw new AppException(ErrorCode.INVALID_DELIVERY_STATUS);
                }
                delivery.setStatus(DeliveryStatus.PICKED_UP);
                break;
            case DELIVERING:
                if (delivery.getStatus() != DeliveryStatus.PICKED_UP) {
                    throw new AppException(ErrorCode.INVALID_DELIVERY_STATUS);
                }
                delivery.setStatus(DeliveryStatus.DELIVERING);
                break;
            case SUCCESS:
//                if (delivery.getStatus() != DeliveryStatus.DELIVERING) {
//                    throw new AppException(ErrorCode.INVALID_DELIVERY_STATUS);
//                }
                delivery.setStatus(DeliveryStatus.SUCCESS);
                Order order = delivery.getOrder();
                if (order != null) {
                    order.setStatus(OrderStatus.DELIVERED);
                    orderRepository.save(order);
                }
                break;
            case CANCELLED:
                if (delivery.getStatus() == DeliveryStatus.DELIVERING) {
                    throw new AppException(ErrorCode.INVALID_DELIVERY_STATUS);
                }
                delivery.setStatus(DeliveryStatus.CANCELLED);
                break;
            default:
                delivery.setStatus(newStatus);
                throw new AppException(ErrorCode.INVALID_DELIVERY_STATUS);
        }

    }

    @Override
    @Transactional
    public void acceptDelivery(Long deliveryId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        ShipperProfile shipper = shipperProfileRepository.findByUser(user)
                .orElseThrow(() -> new AppException(ErrorCode.SHIPPER_PROFILE_NOT_FOUND));
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new AppException(ErrorCode.DELIVERY_NOT_FOUND));
        Order order = delivery.getOrder();
        if (delivery.getStatus() != DeliveryStatus.PENDING || delivery.getShipper() != null) {
            throw new AppException(ErrorCode.DELIVERY_ALREADY_ACCEPTED);
        }
        List<Delivery> activeDeliveries = shipper.getDeliveries();
        delivery.setShipper(shipper);
        delivery.setStatus(DeliveryStatus.PICKED_UP);
        deliveryRepository.save(delivery);

        activeDeliveries.add(delivery);
        order.setStatus(OrderStatus.SHIPPING);
        orderRepository.save(order);

        shipper.setDeliveries(activeDeliveries);
        shipperProfileRepository.save(shipper);

    }


    @Override
    public Page<ShipperDeliveryResponse> getDeliveriesByShipper(Pageable pageable) {
        return deliveryRepository.getUnassignedDeliveries(pageable).map(deliveryMapper::toShipperDeliveryResponse);
    }

    @Override
    public Page<AdminDeliveryResponse> getAllDeliveries(DeliveryStatus status, Pageable pageable) {
        if (status != null) {
            return deliveryRepository.findByStatus(status, pageable).map(deliveryMapper::toAdminDeliveryResponse);
        } else {
            return deliveryRepository.findAll(pageable).map(deliveryMapper::toAdminDeliveryResponse);
        }
    }

    @Override
    public DeliveryStatus parseStatus(String status) {
        try {
            if (status == null) {
                return null;
            }
            return DeliveryStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_DELIVERY_STATUS);
        }
    }

    @Override
    public ShipperDeliveryResponse getDeliveryById(Long deliveryId) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new AppException(ErrorCode.DELIVERY_NOT_FOUND));
        return deliveryMapper.toShipperDeliveryResponse(delivery);
    }

    @Override
    public Page<ShipperDeliveryResponse> getAllDeliveryByStatus(String status, String email, Pageable pageable) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        ShipperProfile shipper = shipperProfileRepository.findByUser(user)
                .orElseThrow(() -> new AppException(ErrorCode.SHIPPER_PROFILE_NOT_FOUND));
        DeliveryStatus deliveryStatus = parseStatus(status);
        return deliveryRepository.getDeliveriesByStatusAndShipper(deliveryStatus, shipper, pageable)
                .map(deliveryMapper::toShipperDeliveryResponse);
    }
}
