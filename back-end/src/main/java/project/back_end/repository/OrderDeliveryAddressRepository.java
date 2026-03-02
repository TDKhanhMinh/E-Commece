package project.back_end.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.back_end.entity.OrderDeliveryAddress;

public interface OrderDeliveryAddressRepository
        extends JpaRepository<OrderDeliveryAddress, Long> {
}
