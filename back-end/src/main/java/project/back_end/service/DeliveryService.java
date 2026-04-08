package project.back_end.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import project.back_end.entity.Order;
import project.back_end.enumerate.DeliveryStatus;
import project.back_end.response.AdminDeliveryResponse;

public interface DeliveryService {
    void createDeliveryForOrder(Order order);

    void updateDeliveryStatus(Long deliveryId, String status);

    void acceptDelivery(Long deliveryId, String email);

    DeliveryStatus parseStatus(String status);

    Page<?> getDeliveriesByUser(String email, Pageable pageable);

    Page<AdminDeliveryResponse> getAllDeliveries(DeliveryStatus status, Pageable pageable);
}
