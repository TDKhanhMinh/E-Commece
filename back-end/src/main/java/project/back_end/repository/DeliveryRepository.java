package project.back_end.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import project.back_end.entity.Delivery;
import project.back_end.entity.ShipperProfile;
import project.back_end.enumerate.DeliveryStatus;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    
    boolean existsByOrderId(Long orderId);
    
    @Query("SELECT d FROM Delivery d WHERE d.shipper is null ORDER BY d.createdAt DESC")
    Page<Delivery> getUnassignedDeliveries(Pageable pageable);

    @Query("SELECT d FROM Delivery d JOIN d.order o JOIN o.deliveryAddress a " +
            "WHERE (:status IS NULL OR d.status = :status) " +
            "AND (:search IS NULL OR LOWER(a.userName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(a.phoneNumber) LIKE LOWER(CONCAT('%', :search, '%'))) "
            +
            "AND (:startDate IS NULL OR d.createdAt >= :startDate) " +
            "AND (:endDate IS NULL OR d.createdAt <= :endDate) " +
            "ORDER BY d.createdAt DESC")
    Page<Delivery> filterDeliveries(
            DeliveryStatus status,
            String search,
            java.time.LocalDateTime startDate,
            java.time.LocalDateTime endDate,
            Pageable pageable);

    Page<Delivery> getDeliveriesByStatusAndShipper(DeliveryStatus status, ShipperProfile shipper, Pageable pageable);
}
