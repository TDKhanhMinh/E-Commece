package project.back_end.service;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import project.back_end.enumerate.OrderStatus;
import project.back_end.request.CheckoutRequest;
import project.back_end.response.OrderResponse;

@Service
public interface OrderService {

    OrderResponse checkout(String email, CheckoutRequest request);

    OrderResponse getOrderDetail(Long orderId);

    Page<OrderResponse> getOrdersByUser(String email, OrderStatus status, Pageable pageable);

    Page<OrderResponse> getAllOrders(OrderStatus status, String startDate, String endDate, String deliveryStartDate, String deliveryEndDate, Pageable pageable);



    void updateOrderStatus(Long orderId, String status);

    void cancelOrder(Long orderId);
}
