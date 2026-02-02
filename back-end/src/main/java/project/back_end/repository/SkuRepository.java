package project.back_end.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.back_end.entity.product.Sku;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface SkuRepository extends JpaRepository<Sku, Long> {

    // 1. Lấy tất cả biến thể của 1 sản phẩm (Để hiển thị ở trang chi tiết)
    List<Sku> findByProductId(Long productId);

    // 2. Tìm theo mã SKU (Dùng khi quét mã vạch hoặc check kho)
    Optional<Sku> findByCode(String skuCode);

    // 3. Tìm các SKU có giá trong khoảng (Dùng cho bộ lọc giá)
    List<Sku> findByProductIdAndPriceBetween(Long productId, BigDecimal min, BigDecimal max);
}