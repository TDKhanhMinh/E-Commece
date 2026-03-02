package project.back_end.service;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import project.back_end.entity.OrderStatus;
import project.back_end.request.CheckoutRequest;
import project.back_end.response.OrderResponse;

public interface OrderService {

    OrderResponse checkout(Long userId, CheckoutRequest request);

    OrderResponse getOrderDetail(Long orderId);

    Page<OrderResponse> getOrdersByUser(String email, OrderStatus status, Pageable pageable);

    void updateOrderStatus(Long orderId, String status);

    void cancelOrder(Long orderId);
}
