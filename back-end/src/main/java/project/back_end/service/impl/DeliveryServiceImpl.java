package project.back_end.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
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
import project.back_end.response.DirectionsResponse;
import project.back_end.response.ShipperDeliveryResponse;
import project.back_end.service.DeliveryService;
import project.back_end.service.GoongMapService;
import project.back_end.service.OrderService;
import project.back_end.service.WalletService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
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
    private final ObjectProvider<OrderService> orderService;
    private final WalletService walletService;
    private final GoongMapService goongMapService;

    @Override
    public void createDeliveryForOrder(Order order) {
        DirectionsResponse directions = goongMapService.getDirections(
                Double.parseDouble("10.732091380000043"), Double.parseDouble("106.69945521900007"),
                Double.parseDouble(order.getDeliveryAddress().getLatitude()),
                Double.parseDouble(order.getDeliveryAddress().getLongitude()));
        Delivery delivery = new Delivery();
        delivery.setOrder(order);
        delivery.setShipper(null);
        delivery.setPickupAddress("Đại học Tôn Đức Thắng, 19 Nguyễn Hữu Thọ, Tân Phong, Quận 7, Hồ Chí Minh");
        delivery.setPickupLatitude("10.732091380000043");
        delivery.setPickupLongitude("106.69945521900007");
        delivery.setStatus(DeliveryStatus.PENDING);
        delivery.setAmountToCollect(order.getFinalAmount());
        if (directions != null) {
            delivery.setEncodedPolyline(directions.getEncodedPolyline());
            delivery.setDistanceText(directions.getDistanceText());
            delivery.setDistanceValue(directions.getDistanceValue());
            delivery.setDurationText(directions.getDurationText());
        }
        delivery.setShippingCost(
                calculateShippingFee(order.getShippingCost(), directions != null ? directions.getDistanceValue() : 0));
        order.setDelivery(delivery);

        deliveryRepository.save(delivery);
        List<User> shippers = userRepository.getAllByRole(User.Role.SHIPPER);
        for (User shipper : shippers) {
            if (shipper.getDeviceToken() != null) {
                log.error("Gửi thông báo đến shipper); email: {}, deviceToken: {}", shipper.getEmail(),
                        shipper.getDeviceToken());
                notificationService.sendNotification(
                        shipper.getDeviceToken(),
                        "Đơn hàng mới",
                        "Có đơn hàng mới. Vui lòng kiểm tra!");
            }
        }
    }

    @Override
    public void updateDeliveryStatus(Long deliveryId, String status, String proofImage, String email) {
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
                if (proofImage.isEmpty()) {
                    throw new AppException(ErrorCode.PROOF_IMAGE_REQUIRED);
                }
                delivery.setStatus(DeliveryStatus.SUCCESS);
                Order order = delivery.getOrder();
                if (order != null) {
                    orderService.getObject().updateOrderStatus(order.getId(), "DELIVERED");
                    order.setProofImageUrl(proofImage);
                    orderRepository.save(order);
                    walletService.addDeliveryFee(email, delivery.getShippingCost(), delivery.getOrder().getId());
                }

                break;
            case CANCELLED:
                if (delivery.getStatus() == DeliveryStatus.DELIVERING) {
                    throw new AppException(ErrorCode.INVALID_DELIVERY_STATUS);
                }
                delivery.setStatus(DeliveryStatus.CANCELLED);
                deliveryRepository.save(delivery);
                orderService.getObject().updateOrderStatus(delivery.getOrder().getId(), "CANCELLED");
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
    public Page<AdminDeliveryResponse> getAllDeliveries(DeliveryStatus status, String search, String startDate,
            String endDate, Pageable pageable) {
        LocalDateTime createdAtAfter = null;
        LocalDateTime createdAtBefore = null;

        if (startDate != null && !startDate.isEmpty() && !startDate.equalsIgnoreCase("null")) {
            try {
                if (startDate.contains("T")) {
                    createdAtAfter = LocalDateTime.parse(startDate);
                } else {
                    createdAtAfter = java.time.LocalDate.parse(startDate).atStartOfDay();
                }
            } catch (Exception e) {
                log.error("Error parsing startDate: {}", startDate);
            }
        }

        if (endDate != null && !endDate.isEmpty() && !endDate.equalsIgnoreCase("null")) {
            try {
                if (endDate.contains("T")) {
                    createdAtBefore = LocalDateTime.parse(endDate);
                } else {
                    createdAtBefore = java.time.LocalDate.parse(endDate).atTime(23, 59, 59);
                }
            } catch (Exception e) {
                log.error("Error parsing endDate: {}", endDate);
            }
        }

        return deliveryRepository.filterDeliveries(status, search, createdAtAfter, createdAtBefore, pageable)
                .map(deliveryMapper::toAdminDeliveryResponse);
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

    public BigDecimal calculateShippingFee(BigDecimal defaultCost, long distanceInMeters) {
        BigDecimal feePerKm = new BigDecimal("5000");

        BigDecimal distance = BigDecimal.valueOf(distanceInMeters);
        BigDecimal divisor = new BigDecimal("1000");

        BigDecimal distanceInKm = distance.divide(divisor);

        BigDecimal distanceFee = distanceInKm.multiply(feePerKm).setScale(0, RoundingMode.HALF_UP);

        return defaultCost.add(distanceFee);
    }

}
