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


    @Transactional
    public OrderResponse checkout(Long userId, CheckoutRequest request) {

        // ======================
        // Validate User & Address
        // ======================
        User user = userRepository.findById(userId)
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

            BigDecimal quantity = BigDecimal.valueOf(item.getQuantity());

            BigDecimal originTotal = sku.getPrice().multiply(quantity);
            BigDecimal saleTotal = sku.getSalePrice().multiply(quantity);
            BigDecimal discount = originTotal.subtract(saleTotal);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setSkuId(item.getSkuId());
            orderItem.setSkuCode(sku.getCode());
            orderItem.setProductName(
                    sku.getProduct().getName() + " - " + sku.getCode()
            );
            orderItem.setPrice(sku.getPrice());
            orderItem.setSalePrice(sku.getSalePrice());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setTotalPrice(saleTotal);

            orderItems.add(orderItem);
            skuIdsToRemove.add(item.getSkuId());

            totalAmount = totalAmount.add(originTotal);
            finalAmount = finalAmount.add(saleTotal);
            totalDiscount = totalDiscount.add(discount);
            totalItems += item.getQuantity();
        }


        // ======================
        // Update Order totals
        // ======================
        order.setTotalAmount(totalAmount);
        order.setTotalDiscount(totalDiscount);
        order.setFinalAmount(finalAmount);
        order.setTotalItems(totalItems);

        orderRepository.save(order);
        orderItemRepository.saveAll(orderItems);

        // ======================
        // Remove items from cart after successful checkout
        // ======================
        Cart cart = cartRepository.findByUserId(userId).orElse(null);
        if (cart != null) {
            for (Long skuId : skuIdsToRemove) {
                cartItemRepository.deleteByCartIdAndSkuId(cart.getId(), skuId);
            }
            log.info("Removed {} items from cart for user {}", skuIdsToRemove.size(), userId);
        }

        // ======================
        // Build Response
        // ======================
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
    public void updateOrderStatus(Long orderId, String status) {

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
        for (OrderItem item : orderItems) {
            Sku sku = skuRepository.findById(item.getSkuId())
                    .orElseThrow(() -> new AppException(ErrorCode.SKU_NOT_FOUND));

            sku.setStock(sku.getStock() + item.getQuantity());
            skuRepository.save(sku);
            log.info("Restored {} units to SKU {} (new stock: {})",
                    item.getQuantity(), sku.getCode(), sku.getStock());
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
        log.info("Order {} has been cancelled and stock restored", orderId);
    }
}
