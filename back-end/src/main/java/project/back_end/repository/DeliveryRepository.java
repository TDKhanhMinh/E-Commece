package project.back_end.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import project.back_end.entity.Delivery;
import project.back_end.entity.ShipperProfile;
import project.back_end.enumerate.DeliveryStatus;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    @Query("SELECT d FROM Delivery d WHERE d.status = :status ORDER BY d.createdAt DESC")
    Page<Delivery> findByStatus(DeliveryStatus status, Pageable pageable);

    @Query("SELECT d FROM Delivery d WHERE d.shipper is null ORDER BY d.createdAt DESC")
    Page<Delivery> getUnassignedDeliveries(Pageable pageable);

    Page<Delivery> getDeliveriesByStatusAndShipper(DeliveryStatus status, ShipperProfile shipper, Pageable pageable);
}
