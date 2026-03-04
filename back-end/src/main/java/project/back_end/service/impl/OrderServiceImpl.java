package project.back_end.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.back_end.entity.*;
import project.back_end.entity.product.Sku;
import project.back_end.exception.AppException;
import project.back_end.exception.ErrorCode;
import project.back_end.mapper.CheckoutMapper;
import project.back_end.repository.*;
import project.back_end.request.CheckoutItemRequest;
import project.back_end.request.CheckoutRequest;
import project.back_end.response.OrderResponse;
import project.back_end.service.OrderService;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @Transactional
    public OrderResponse checkout(String email, CheckoutRequest request) {

        // ======================
        // Validate User & Address
        // ======================
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        log.info("Checkout request addressId: {}", request.getDeliveryAddressId());
        log.info("Checkout request items: {}", request.getItems());
        log.info("Checkout request user: {}", user.getId());

        DeliveryAddress addressRequest = deliveryAddressRepository
                .findById(request.getDeliveryAddressId())
                .orElseThrow(() -> new AppException(ErrorCode.DELIVERY_ADDRESS_NOT_FOUND));

        // ======================
        // Init totals
        // ======================
        BigDecimal totalAmount = BigDecimal.ZERO;     // tổng giá gốc
        BigDecimal totalDiscount = BigDecimal.ZERO;   // tổng giảm
        BigDecimal finalAmount = BigDecimal.ZERO;     // tổng phải trả
        int totalItems = 0;

        // ======================
        // Create Order (no totals yet)
        // ======================
        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());
        order.setShippingMethod(request.getShippingMethod());
        order.setPaymentMethod(request.getPaymentMethod());
        // ======================
        // Delivery Address Snapshot
        // ======================
        OrderDeliveryAddress address = new OrderDeliveryAddress();
        address.setLocation(addressRequest.getLocation());
        address.setUserName(addressRequest.getUserName());
        address.setPhoneNumber(addressRequest.getPhoneNumber());

        orderDeliveryAddressRepository.save(address);
        order.setDeliveryAddress(address);
        orderRepository.save(order);

        // ======================
        // Create Order Items + Calculate totals
        // ======================
        List<OrderItem> orderItems = new ArrayList<>();
        List<Long> skuIdsToRemove = new ArrayList<>();

        for (CheckoutItemRequest item : request.getItems()) {

            Sku sku = skuRepository.findById(item.getSkuId())
                    .orElseThrow(() -> new AppException(ErrorCode.SKU_NOT_FOUND));

            // ======================
            // Validate stock availability
            // ======================
            if (sku.getStock() == null || sku.getStock() < item.getQuantity()) {
                throw new AppException(ErrorCode.INSUFFICIENT_STOCK);
            }

            // ======================
            // Deduct stock
            // ======================
            sku.setStock(sku.getStock() - item.getQuantity());
            skuRepository.save(sku);
            log.info("Deducted {} units from SKU {} (remaining: {})",
                    item.getQuantity(), sku.getCode(), sku.getStock());


            log.info("Processing item: SKU {}, quantity {}, price {}, salePrice {}",
                    sku.getCode(), item.getQuantity(), sku.getPrice(), sku.getSalePrice());

            BigDecimal quantity = BigDecimal.valueOf(item.getQuantity());
            BigDecimal originTotal = sku.getPrice().multiply(quantity); // Tổng giá gốc

            BigDecimal saleTotal;
            BigDecimal discount;

            // 1. Xử lý an toàn: Kiểm tra nếu có giá sale thì dùng giá sale, không thì dùng giá gốc
            if (sku.getSalePrice() != null) {
                saleTotal = sku.getSalePrice().multiply(quantity);
                discount = originTotal.subtract(saleTotal);
            } else {
                saleTotal = originTotal; // Không có sale thì tổng trả = tổng gốc
                discount = BigDecimal.ZERO; // Không có sale thì giảm giá = 0
            }

            // 2. Tạo OrderItem
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setSkuId(item.getSkuId());
            orderItem.setSkuCode(sku.getCode());
            orderItem.setProductName(
                    sku.getProduct().getName()
            );

            // Xử lý image an toàn
            String imageUrl = "https://th.bing.com/th/id/R.5fa32d0f91bb6befd88027725b4f2e0d?rik=6PlumKuW4AsJxQ&pid=ImgRaw&r=0";
            if (sku.getImages() != null && !sku.getImages().isEmpty()) {
                imageUrl = sku.getImages().get(0);
            }
            orderItem.setImage(imageUrl);
            orderItem.setSku(sku.getCode());
            orderItem.setPrice(sku.getPrice());

            if (sku.getSalePrice() != null) {
                orderItem.setSalePrice(sku.getSalePrice());
            } else {
                orderItem.setSalePrice(sku.getPrice());
            }

            orderItem.setQuantity(item.getQuantity());
            orderItem.setTotalPrice(saleTotal);

            orderItems.add(orderItem);
            skuIdsToRemove.add(item.getSkuId());

            // Cộng dồn vào tổng đơn hàng
            totalAmount = totalAmount.add(originTotal);
            finalAmount = finalAmount.add(saleTotal);
            totalDiscount = totalDiscount.add(discount);
            totalItems += item.getQuantity();
        }
        double shippingFeeValue = shippingService.calculateShippingFee(
                request.getShippingMethod(),
                totalAmount.doubleValue()
        );

        BigDecimal shippingFee = BigDecimal.valueOf(shippingFeeValue);

        BigDecimal grandTotal = finalAmount.add(shippingFee);

        order.setShippingCost(shippingFee);
        order.setTotalAmount(totalAmount);
        order.setTotalDiscount(totalDiscount);
        order.setFinalAmount(grandTotal);
        order.setTotalItems(totalItems);

        orderRepository.save(order);
        orderItemRepository.saveAll(orderItems);

        Cart cart = cartRepository.findByUserId(user.getId()).orElse(null);
        if (cart != null) {
            for (Long skuId : skuIdsToRemove) {
                cartItemRepository.deleteByCartIdAndSkuId(cart.getId(), skuId);
            }
            log.info("Removed {} items from cart for user {}", skuIdsToRemove.size(), user.getId());
        }

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
    @Transactional
    public void updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        log.info("Current order {} input status: {}", orderId, status);

        OrderStatus newStatus;
        try {
            newStatus = OrderStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        OrderStatus currentStatus = order.getStatus();
        LocalDateTime now = LocalDateTime.now();

        if (currentStatus == OrderStatus.CANCELLED || currentStatus == OrderStatus.DELIVERED) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        switch (newStatus) {
            case PENDING:
                break;

            case CONFIRMED:
                if (currentStatus != OrderStatus.PENDING) {
                    throw new AppException(ErrorCode.INVALID_REQUEST);
                }
                order.setConfirmedAt(now);
                break;

            case PAID:
                if (currentStatus != OrderStatus.PENDING && currentStatus != OrderStatus.CONFIRMED) {
                    throw new AppException(ErrorCode.INVALID_REQUEST);
                }
                break;

            case SHIPPING:
                if (currentStatus != OrderStatus.CONFIRMED && currentStatus != OrderStatus.PAID) {
                    throw new AppException(ErrorCode.INVALID_REQUEST);
                }
                break;

            case DELIVERED:
                if (currentStatus != OrderStatus.SHIPPING) {
                    throw new AppException(ErrorCode.INVALID_REQUEST);
                }
                order.setDeliveredAt(now);
                break;

            case CANCELLED:
                if (currentStatus == OrderStatus.SHIPPING) {
                    throw new AppException(ErrorCode.INVALID_REQUEST);
                }
                order.setCancelledAt(now);

                List<OrderItem> orderItems = orderItemRepository.findByOrderId(orderId);
                RestoreStock(orderItems);
                break;

            case FAILED:
                if (currentStatus == OrderStatus.SHIPPING) {
                    throw new AppException(ErrorCode.INVALID_REQUEST);
                }
                List<OrderItem> failedOrderItems = orderItemRepository.findByOrderId(orderId);
                for (OrderItem item : failedOrderItems) {
                    Sku sku = skuRepository.findById(item.getSkuId())
                            .orElseThrow(() -> new AppException(ErrorCode.SKU_NOT_FOUND));

                    sku.setStock(sku.getStock() + item.getQuantity());
                    skuRepository.save(sku);
                }
                break;
        }

        order.setStatus(newStatus);
        order.setUpdatedAt(now);
        orderRepository.save(order);

        log.info("Updated order {} status to {} at {}", orderId, newStatus, now);
    }

    @Override
    @Transactional
    public void cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        // ======================
        // Restore stock for all order items
        // ======================
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
