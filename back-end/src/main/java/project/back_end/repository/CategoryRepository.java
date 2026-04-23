package project.back_end.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.back_end.entity.product.Category;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // 1. Lấy danh sách danh mục gốc (Menu cấp 1)
    List<Category> findByParentIsNull();

    // 2. Lấy danh mục con theo ID cha (Khi user click mở menu)
    List<Category> findByParentId(Long parentId);

    // 3. Tìm theo Slug (Để làm SEO URL: shopee.vn/dien-thoai)
    Optional<Category> findBySlug(String slug);

    // 4. Kiểm tra xem danh mục có tồn tại không (Tránh trùng tên)
    boolean existsByName(String name);

    // 5. Tìm kiếm danh mục gốc với phân trang
    @Query("SELECT c FROM Category c WHERE c.parent IS NULL " +
            "AND (CAST(:keyword AS text) IS NULL OR CAST(:keyword AS text) = '' OR " +
            "LOWER(c.name) LIKE LOWER(CONCAT('%', CAST(:keyword AS text), '%')) OR " +
            "LOWER(c.slug) LIKE LOWER(CONCAT('%', CAST(:keyword AS text), '%')))")
    Page<Category> searchRootCategories(@Param("keyword") String keyword, Pageable pageable);
}