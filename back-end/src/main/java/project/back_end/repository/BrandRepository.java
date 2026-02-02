package project.back_end.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.back_end.entity.product.Brand;

import java.util.List;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {
    // Tìm kiếm brand theo tên (Cho ô search admin)
    List<Brand> findByNameContainingIgnoreCase(String name);
}