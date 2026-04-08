package project.back_end.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import project.back_end.entity.KpiProjection;
import project.back_end.entity.Order;
import project.back_end.enumerate.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);

    @Query("SELECT o FROM Order o WHERE o.user.id = :userId ORDER BY o.createdAt DESC")
    List<Order> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    @Query("SELECT o FROM Order o WHERE o.user.id = :userId ORDER BY o.createdAt DESC")
    Page<Order> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT o FROM Order o WHERE o.user.id = :userId AND o.status = :status ORDER BY o.createdAt DESC")
    List<Order> findByUserIdAndStatusOrderByCreatedAtDesc(@Param("userId") Long userId, @Param("status") OrderStatus status);

    @Query("SELECT o FROM Order o WHERE o.user.id = :userId AND o.status = :status ORDER BY o.createdAt DESC")
    Page<Order> findByUserIdAndStatusOrderByCreatedAtDesc(@Param("userId") Long userId, @Param("status") OrderStatus status, Pageable pageable);

    @Query("SELECT o FROM Order o WHERE o.status = :status ORDER BY o.createdAt DESC")
    Page<Order> findAllByStatusAndCreatedAtDesc(@Param("status") OrderStatus status, Pageable pageable);

    @Query("SELECT o FROM Order o ORDER BY o.createdAt DESC")
    Page<Order> findAllByCreatedAtDesc(Pageable pageable);


    @Query("SELECT SUM(o.finalAmount) as totalRevenue, COUNT(o.id) as orderCount " +
            "FROM Order o " +
            "WHERE o.status IN ('DELIVERED', 'PAID') " +
            "AND o.createdAt BETWEEN :startDate AND :endDate")
    KpiProjection getRevenueAndOrderCount(@Param("startDate") LocalDateTime startDate,
                                          @Param("endDate") LocalDateTime endDate);

    // 2. Lấy dữ liệu cho biểu đồ (Nhóm theo ngày)
    @Query("SELECT FUNCTION('DATE', o.createdAt) as date, SUM(o.finalAmount) as revenue " +
            "FROM Order o " +
            "WHERE o.status IN ('DELIVERED', 'PAID') " +
            "AND o.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY FUNCTION('DATE', o.createdAt) ")
    List<Object[]> getRevenueChartData(@Param("startDate") LocalDateTime startDate,
                                       @Param("endDate") LocalDateTime endDate);

    long countByStatusAndCreatedAtBetween(
            OrderStatus status,
            LocalDateTime startDate,
            LocalDateTime endDate
    );
}
