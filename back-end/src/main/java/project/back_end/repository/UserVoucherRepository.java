package project.back_end.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.back_end.entity.UserVoucher;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserVoucherRepository extends JpaRepository<UserVoucher, Long> {

    // Lấy danh sách voucher trong kho của User mà chưa được sử dụng
    // Dùng để hiển thị lên Popover ở Frontend
    List<UserVoucher> findByUserIdAndIsUsedFalse(Long userId);

    // Kiểm tra xem User cụ thể đã sở hữu một Voucher cụ thể nào đó chưa
    // Tránh việc User thu thập (collect) một mã nhiều lần vào ví
    Optional<UserVoucher> findByUserIdAndVoucherId(Long userId, Long voucherId);

    // Tìm kiếm voucher cụ thể trong ví của User dựa trên mã Code
    // Dùng để đánh dấu isUsed = true sau khi đặt hàng thành công
    Optional<UserVoucher> findByUserIdAndVoucherCodeAndIsUsedFalse(Long userId, String code);

    List<UserVoucher> findByUserId(Long userId);
}