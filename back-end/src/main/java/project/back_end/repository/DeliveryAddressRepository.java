package project.back_end.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.back_end.entity.DeliveryAddress;

import java.util.List;

public interface DeliveryAddressRepository extends JpaRepository<DeliveryAddress, Long> {

    List<DeliveryAddress> findByUserId(Long id);
}
