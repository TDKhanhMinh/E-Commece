package project.back_end.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.back_end.entity.DeliveryAddress;
import project.back_end.entity.User;

import java.util.List;
import java.util.Optional;

public interface DeliveryAddressRepository extends JpaRepository<DeliveryAddress, Long> {

    List<DeliveryAddress> findByUserId(Long id);

    Optional<DeliveryAddress> findByUserAndIsDefaultTrue(User currentUser);
}
