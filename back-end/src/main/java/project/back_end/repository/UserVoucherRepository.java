package project.back_end.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.back_end.entity.UserVoucher;

import java.util.Optional;

@Repository
public interface UserVoucherRepository extends JpaRepository<UserVoucher, Long> {

    Page<UserVoucher> findByUserIdAndIsUsedFalse(Long userId, Pageable pageable);

    Page<UserVoucher> findByUserId(Long userId, Pageable pageable);

    // Kiểm tra xem User cụ thể đã sở hữu một Voucher cụ thể nào đó chưa
    // Tránh việc User thu thập (collect) một mã nhiều lần vào ví
    Optional<UserVoucher> findByUserIdAndVoucherId(Long userId, Long voucherId);

    // Tìm kiếm voucher cụ thể trong ví của User dựa trên mã Code
    // Dùng để đánh dấu isUsed = true sau khi đặt hàng thành công
    Optional<UserVoucher> findByUserIdAndVoucherCodeAndIsUsedFalse(Long userId, String code);

}