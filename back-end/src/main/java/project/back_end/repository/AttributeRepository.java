package project.back_end.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.back_end.entity.product.Attribute;

import java.util.Optional;

@Repository
public interface AttributeRepository extends JpaRepository<Attribute, Long> {
    // Tìm theo code (Vd: code="color" để hệ thống xử lý logic màu sắc)
    Optional<Attribute> findByCode(String code);
}