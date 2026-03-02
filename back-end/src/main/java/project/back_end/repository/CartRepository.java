package project.back_end.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.back_end.entity.Cart;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    Optional<Cart> findByUserId(Long userId);
}
