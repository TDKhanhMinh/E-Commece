package project.back_end.repository;

import org.springframework.data.jpa.repository.JpaRepository;
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
}