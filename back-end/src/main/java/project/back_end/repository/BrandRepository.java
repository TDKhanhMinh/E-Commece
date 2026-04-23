package project.back_end.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.back_end.entity.product.Brand;

import java.util.List;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {
    // Tìm kiếm brand theo tên (Cho ô search admin)
    List<Brand> findByNameContainingIgnoreCase(String name);

    // Tìm kiếm brand với phân trang
    @Query("SELECT b FROM Brand b WHERE " +
            "(CAST(:keyword AS text) IS NULL OR CAST(:keyword AS text) = '' OR " +
            "LOWER(b.name) LIKE LOWER(CONCAT('%', CAST(:keyword AS text), '%')) OR " +
            "LOWER(b.slug) LIKE LOWER(CONCAT('%', CAST(:keyword AS text), '%')))")
    Page<Brand> searchBrands(@Param("keyword") String keyword, Pageable pageable);
}