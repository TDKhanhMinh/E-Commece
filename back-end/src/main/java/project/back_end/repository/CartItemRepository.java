package project.back_end.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.back_end.entity.CartItem;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    Optional<CartItem> findByCartIdAndSkuId(Long cartId, Long skuId);

    List<CartItem> findByCartId(Long cartId);

    void deleteByCartIdAndSkuId(Long cartId, Long skuId);
}
