package project.back_end.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.back_end.entity.product.CategoryAttribute;

import java.util.List;

@Repository
public interface CategoryAttributeRepository extends JpaRepository<CategoryAttribute, Long> {
    // Lấy tất cả thuộc tính của một danh mục
    List<CategoryAttribute> findByCategoryId(Long categoryId);
}