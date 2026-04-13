package project.back_end.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.back_end.entity.*;
import project.back_end.entity.product.Sku;
import project.back_end.enumerate.DeliveryStatus;
import project.back_end.enumerate.ErrorCode;
import project.back_end.enumerate.OrderStatus;
import project.back_end.enumerate.PointTransactionType;
import project.back_end.exception.AppException;
import project.back_end.mapper.CheckoutMapper;
import project.back_end.repository.*;
import project.back_end.request.CheckoutItemRequest;
import project.back_end.request.CheckoutRequest;
import project.back_end.response.OrderResponse;
import project.back_end.response.VoucherResponse;
import project.back_end.service.MemberShipPointService;
import project.back_end.service.OrderService;
import project.back_end.service.VoucherService;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderDeliveryAddressRepository orderDeliveryAddressRepository;
    private final UserRepository userRepository;
    private final SkuRepository skuRepository;
    private final DeliveryAddressRepository deliveryAddressRepository;
    private final CheckoutMapper checkoutMapper;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ShippingService shippingService;
    private final VoucherService voucherService;
    private final MemberShipPointService memberShipPointService;
    private final ApplicationEventPublisher eventPublisher;
    private final DeliveryRepository deliveryRepository;

    @Transactional
    public OrderResponse checkout(String email, CheckoutRequest request) {

        // ======================
        // 1. Validate User & Address
        // ======================
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        DeliveryAddress addressRequest = deliveryAddressRepository
                .findById(request.getDeliveryAddressId())
                .orElseThrow(() -> new AppException(ErrorCode.DELIVERY_ADDRESS_NOT_FOUND));

        // ======================
        // 2. Init totals
        // ======================
        BigDecimal totalAmount = BigDecimal.ZERO;     // Tổng giá niêm yết (Price)
        BigDecimal finalAmount = BigDecimal.ZERO;     // Tổng giá sau sale của SKU (SalePrice)
        BigDecimal totalDiscount = BigDecimal.ZERO;   // Tổng giảm giá từ SKU sale
        BigDecimal voucherDiscount = BigDecimal.ZERO; // Tổng giảm giá từ Voucher
        BigDecimal pointDiscount = BigDecimal.ZERO; // Tổng giảm giá từ điểm thưởng

        int totalItems = 0;

        // ======================
        // 3. Create Order Entity
        // ======================
        Order order = new Order();
        order.setUser(user);
        if (!Objects.equals(request.getPaymentMethod(), "COD")) {
            order.setStatus(OrderStatus.UNPAID);
        } else {
            order.setStatus(OrderStatus.PENDING);
        }
        order.setCreatedAt(LocalDateTime.now());
        order.setShippingMethod(request.getShippingMethod());
        order.setPaymentMethod(request.getPaymentMethod());

        // Lưu thông tin địa chỉ snapshot
        OrderDeliveryAddress address = new OrderDeliveryAddress();
        address.setLocation(addressRequest.getLocation());
        address.setUserName(addressRequest.getUserName());
        address.setPhoneNumber(addressRequest.getPhoneNumber());

        address.setLatitude(addressRequest.getLatitude());
        address.setLongitude(addressRequest.getLongitude());

        orderDeliveryAddressRepository.save(address);
        log.error("Saved OrderDeliveryAddress with latitude: {}", address.getLatitude());
        order.setDeliveryAddress(address);
        orderRepository.save(order);

        // ======================
        // 4. Create Order Items & Calculate SKU Totals
        // ======================
        List<OrderItem> orderItems = new ArrayList<>();

        for (CheckoutItemRequest item : request.getItems()) {
            Sku sku = skuRepository.findById(item.getSkuId())
                    .orElseThrow(() -> new AppException(ErrorCode.SKU_NOT_FOUND));

            // Kiểm tra kho và trừ kho
            if (sku.getStock() == null || sku.getStock() < item.getQuantity()) {
                throw new AppException(ErrorCode.INSUFFICIENT_STOCK);
            }
            sku.setStock(sku.getStock() - item.getQuantity());
            skuRepository.save(sku);

            BigDecimal qty = BigDecimal.valueOf(item.getQuantity());
            BigDecimal itemOriginTotal = sku.getPrice().multiply(qty);
            BigDecimal itemSaleTotal = (sku.getSalePrice() != null ? sku.getSalePrice() : sku.getPrice()).multiply(qty);

            // ==========================================
            // TẠO ORDER ITEM - BỔ SUNG ĐẦY ĐỦ CÁC TRƯỜNG
            // ==========================================
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setSkuId(item.getSkuId());

            // Đảm bảo gán giá trị cho sku_code để tránh lỗi SQL State 23000
            orderItem.setSkuCode(sku.getCode());

            orderItem.setProductName(sku.getProduct().getName());
            orderItem.setPrice(sku.getPrice());
            orderItem.setSalePrice(sku.getSalePrice() != null ? sku.getSalePrice() : sku.getPrice());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setTotalPrice(itemSaleTotal);

            // Xử lý ảnh sản phẩm
            String imageUrl = "https://th.bing.com/th/id/R.5fa32d0f91bb6befd88027725b4f2e0d?rik=6PlumKuW4AsJxQ&pid=ImgRaw&r=0";
            if (sku.getImages() != null && !sku.getImages().isEmpty()) {
                imageUrl = sku.getImages().get(0);
            }
            orderItem.setImage(imageUrl);

            orderItem.setSku(sku.getCode());

            orderItems.add(orderItem);

            // Cộng dồn tổng đơn hàng
            totalAmount = totalAmount.add(itemOriginTotal);
            finalAmount = finalAmount.add(itemSaleTotal);
            totalDiscount = totalDiscount.add(itemOriginTotal.subtract(itemSaleTotal));
            totalItems += item.getQuantity();
        }

        // ======================
        // 5. TÍCH HỢP VOUCHER
        // ======================
        if (request.getVoucherCode() != null && !request.getVoucherCode().isEmpty()) {
            VoucherResponse voucher = voucherService.validateVoucher(
                    user.getId(),
                    request.getVoucherCode(),
                    finalAmount.doubleValue()
            );

            // Tính toán số tiền giảm từ Voucher
            if ("PERCENTAGE".equals(voucher.getDiscountType())) {
                BigDecimal percentDiscount = finalAmount.multiply(BigDecimal.valueOf(voucher.getDiscountValue()))
                        .divide(BigDecimal.valueOf(100));

                // Giới hạn giảm giá tối đa (nếu có)
                if (voucher.getMaxDiscount() != null) {
                    percentDiscount = percentDiscount.min(BigDecimal.valueOf(voucher.getMaxDiscount()));
                }
                voucherDiscount = percentDiscount;
            } else {
                // Loại FIXED (giảm tiền mặt)
                voucherDiscount = BigDecimal.valueOf(voucher.getDiscountValue());
            }

            // Cập nhật trạng thái voucher đã sử dụng trong ví người dùng
            voucherService.markVoucherAsUsed(user.getId(), request.getVoucherCode());

            // Lưu mã voucher vào order để đối soát
            order.setVoucherCode(request.getVoucherCode());
            order.setVoucherDiscount(voucherDiscount);
        }

        // ======================
        // 6. Tích hợp sử dụng điểm thưởng
        // ======================
        double pointsToRedeem = request.getPointsUsed() != null ? request.getPointsUsed() : 0.0;
        if (pointsToRedeem > 0) {
            long pointsToRedeemLong = (long) pointsToRedeem;
            memberShipPointService.redeemPoints(user.getId(), pointsToRedeemLong, order.getId(), "Đổi điểm để giảm giá đơn hàng #" + order.getId());
            // Ví dụ: 1 điểm = 100 VND
            pointDiscount = pointDiscount.add(BigDecimal.valueOf(pointsToRedeemLong * 100));
        }

        // ======================
        // 6. Calculate Final Grand Total
        // ======================
        double shippingFeeValue = shippingService.calculateShippingFee(request.getShippingMethod(), totalAmount.doubleValue());
        BigDecimal shippingFee = BigDecimal.valueOf(shippingFeeValue);

        // Tổng cuối cùng = (Tổng sau sale SKU - Giảm giá Voucher) + Phí ship
        BigDecimal grandTotal = finalAmount.subtract(voucherDiscount).subtract(pointDiscount).add(shippingFee);
        order.setShippingCost(shippingFee);
        order.setTotalAmount(totalAmount);
        // Tổng giảm giá = (Giảm từ SKU sale) + (Giảm từ Voucher) + (Giảm từ điểm thưởng)
        order.setProductDiscount(totalDiscount);
        order.setPointDiscount(pointDiscount);
        order.setTotalDiscount(totalDiscount.add(voucherDiscount).add(pointDiscount));
        order.setFinalAmount(grandTotal);
        order.setTotalItems(totalItems);

        orderRepository.save(order);
        orderItemRepository.saveAll(orderItems);

        // Dọn dẹp giỏ hàng
        cartRepository.findByUserId(user.getId()).ifPresent(cart -> {
            for (CheckoutItemRequest item : request.getItems()) {
                cartItemRepository.deleteByCartIdAndSkuId(cart.getId(), item.getSkuId());
            }
        });

        return checkoutMapper.toOrderResponse(order);
    }


    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderDetail(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return checkoutMapper.toOrderResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponse> getOrdersByUser(String email, OrderStatus status, Pageable pageable) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Page<Order> orderPage = (status == null)
                ? orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable)
                : orderRepository.findByUserIdAndStatusOrderByCreatedAtDesc(user.getId(), status, pageable);

        Page<OrderResponse> responsePage = orderPage.map(checkoutMapper::toOrderResponse);

        log.info("Retrieved page {} with {} orders for user {} and status {}",
                pageable.getPageNumber(), responsePage.getNumberOfElements(), email, status);

        return responsePage;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponse> getAllOrders(OrderStatus status, Pageable pageable) {

        Page<Order> orderPage = (status == null)
                ? orderRepository.findAllByCreatedAtDesc(pageable)
                : orderRepository.findAllByStatusAndCreatedAtDesc(status, pageable);

        Page<OrderResponse> responsePage = orderPage.map(checkoutMapper::toOrderResponse);

        log.info("Retrieved page {} with {} orders for user {}",
                pageable.getPageNumber(), responsePage.getNumberOfElements(), status);

        return responsePage;
    }

    @Override
    @Transactional
    public void updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        OrderStatus newStatus = parseStatus(status);
        OrderStatus currentStatus = order.getStatus();

        if (currentStatus == newStatus) {
            log.info("Order {} is already {}, skipping update", orderId, newStatus);
            return;
        }

        log.info("Updating order {} from {} to {}", orderId, currentStatus, newStatus);
        LocalDateTime now = LocalDateTime.now();
        order.setUpdatedAt(now);

        switch (newStatus) {
            case CONFIRMED -> {
                if (currentStatus != OrderStatus.PENDING)
                    throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
                order.setConfirmedAt(now);
                createDeliveryForOrder(order);
            }
            case PAID -> {
                createDeliveryForOrder(order);
            }

            case DELIVERED -> {
                if (currentStatus != OrderStatus.SHIPPING)
                    throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
                order.setDeliveredAt(now);
                awardMembershipPoints(order);
            }

            case CANCELLED, FAILED -> {
                if (currentStatus == OrderStatus.SHIPPING && newStatus == OrderStatus.CANCELLED)
                    throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);

                order.setCancelledAt(now);
                List<OrderItem> items = orderItemRepository.findByOrderId(orderId);
                restoreStockBatch(items);
            }

            default -> {
            }
        }
        order.setStatus(newStatus);
        orderRepository.save(order);
    }

// --- CÁC HÀM HỖ TRỢ (Helper Methods) ---

    private OrderStatus parseStatus(String status) {
        try {
            return OrderStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }
    }


    private void awardMembershipPoints(Order order) {
        BigDecimal amount = order.getFinalAmount();
        if (amount != null && amount.compareTo(BigDecimal.ZERO) > 0) {
            long earnedPoints = amount.longValue() / 100_000;
            if (earnedPoints > 0) {
                memberShipPointService.managePoints(
                        order.getUser().getId(), earnedPoints, PointTransactionType.EARN,
                        order.getId(), "Tích điểm đơn hàng #" + order.getId()
                );
            }
        }
    }

    private void restoreStockBatch(List<OrderItem> items) {
        for (OrderItem item : items) {
            skuRepository.updateStock(item.getSkuId(), item.getQuantity());
        }
    }

    private void createDeliveryForOrder(Order order) {
        Delivery delivery = new Delivery();
        delivery.setOrder(order);
        delivery.setShipper(null);
        delivery.setPickupAddress("Đại học Tôn Đức Thắng, 19 Nguyễn Hữu Thọ, Tân Phong, Quận 7, Hồ Chí Minh");
        delivery.setPickupLatitude("10.732091380000043");
        delivery.setPickupLongitude("106.69945521900007");
        delivery.setStatus(DeliveryStatus.PENDING);
        delivery.setAmountToCollect(order.getFinalAmount());
        order.setDelivery(delivery);
        deliveryRepository.save(delivery);
    }

    @Override
    @Transactional
    public void cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        // Restore stock for all order items
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(orderId);
        RestoreStock(orderItems);

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
        log.info("Order {} has been cancelled and stock restored", orderId);
    }

    private void RestoreStock(List<OrderItem> orderItems) {
        for (OrderItem item : orderItems) {
            Sku sku = skuRepository.findById(item.getSkuId())
                    .orElseThrow(() -> new AppException(ErrorCode.SKU_NOT_FOUND));

            sku.setStock(sku.getStock() + item.getQuantity());
            skuRepository.save(sku);

        }
    }


}
