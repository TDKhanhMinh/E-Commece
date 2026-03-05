package project.back_end.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.back_end.entity.Voucher;

import java.util.Optional;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Long> {
    // Tìm kiếm thông tin voucher qua mã code (ví dụ: FREESHIP, GIAM20K)
    Optional<Voucher> findByCode(String code);
}