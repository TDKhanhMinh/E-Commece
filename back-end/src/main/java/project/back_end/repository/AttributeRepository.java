package project.back_end.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.back_end.entity.product.Attribute;

import java.util.Optional;

@Repository
public interface AttributeRepository extends JpaRepository<Attribute, Long> {
    // Tìm theo code (Vd: code="color" để hệ thống xử lý logic màu sắc)
    Optional<Attribute> findByCode(String code);

    // Tìm kiếm theo name, code với phân trang
    @Query("SELECT a FROM Attribute a WHERE " +
            "(CAST(:keyword AS text) IS NULL OR CAST(:keyword AS text) = '' OR " +
            "LOWER(a.name) LIKE LOWER(CONCAT('%', CAST(:keyword AS text), '%')) OR " +
            "LOWER(a.code) LIKE LOWER(CONCAT('%', CAST(:keyword AS text), '%')))")
    Page<Attribute> searchAttributes(@Param("keyword") String keyword, Pageable pageable);
}