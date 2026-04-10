package project.back_end.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.back_end.entity.ShipperProfile;
import project.back_end.entity.User;

import java.util.Optional;

public interface ShipperProfileRepository extends JpaRepository<ShipperProfile, Long> {
    Optional<ShipperProfile> findByUser(User user);

}
