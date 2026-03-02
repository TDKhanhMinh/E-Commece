package project.back_end.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import project.back_end.entity.OrderItem;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrderId(Long orderId);
}
