package project.back_end.repository;


import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import project.back_end.entity.OrderItem;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrderId(Long orderId);

    // Lấy top sản phẩm bán chạy nhất
    @Query("SELECT oi.productName, SUM(oi.quantity) as totalSales, SUM(oi.totalPrice) as totalRevenue " +
            "FROM OrderItem oi " +
            "JOIN oi.order o " +
            "WHERE o.status IN ('DELIVERED', 'PAID') " +
            "AND o.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY oi.productName " +
            "ORDER BY SUM(oi.totalPrice) DESC")
    List<Object[]> getTopSellingProducts(@Param("startDate") LocalDateTime startDate,
                                         @Param("endDate") LocalDateTime endDate,
                                         Pageable pageable);
}
