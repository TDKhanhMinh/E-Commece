package project.back_end.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.back_end.entity.product.Product;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    @Query("SELECT p FROM Product p WHERE " +
            "(:keyword IS NULL OR :keyword = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:categoryId IS NULL OR p.category.id = :categoryId) " +
            "AND (:brandId IS NULL OR p.brand.id = :brandId)")
    Page<Product> searchProducts(
            @Param("keyword") String keyword,
            @Param("categoryId") Long categoryId,
            @Param("brandId") Long brandId,
            Pageable pageable
    );

    // 1. Tìm theo Category (Hiển thị trang danh mục)
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);

    // 2. Tìm theo Brand (Hiển thị trang thương hiệu)
    Page<Product> findByBrandId(Long brandId, Pageable pageable);

    // 3. Tìm kiếm theo tên sản phẩm (Search bar)
    Page<Product> findByNameContainingIgnoreCase(String keyword, Pageable pageable);

    // 4. Kiểm tra slug tồn tại chưa (Khi tạo mới sản phẩm)
    boolean existsBySlug(String slug);

    // 5. Query nâng cao (Ví dụ: Tìm sản phẩm có thuộc tính là "Màn hình 15 inch")
    @Query("SELECT p FROM Product p JOIN p.specs s WHERE s.attribute.code = :attrCode AND s.value LIKE %:value%")
    List<Product> findBySpec(@Param("attrCode") String attrCode, @Param("value") String value);

    Optional<Object> findBySlug(String slug);
}