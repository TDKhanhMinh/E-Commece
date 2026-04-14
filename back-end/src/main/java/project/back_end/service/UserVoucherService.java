package project.back_end.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import project.back_end.entity.UserVoucher;
import project.back_end.response.UserVoucherResponse;

@Service
public interface UserVoucherService {

    // Lấy tất cả voucher chưa sử dụng trong ví (trả về Response cho FE)
    Page<UserVoucherResponse> getAvailableVouchers(Long userId, Pageable pageable);

    boolean isVoucherOwned(Long userId, Long voucherId);

    // ================= HÀM NỘI BỘ (Helper) =================
    // Trả về Entity để sử dụng logic nội bộ ở các Service khác (như OrderService)
    UserVoucher getUserVoucherEntity(Long userId, String voucherCode);

    void updateUsageStatus(UserVoucher userVoucher);

    // ================= CRUD CHO ADMIN =================

    // Admin cấp phát mã (trả về Response)
    UserVoucherResponse assignVoucherToUser(Long userId, Long voucherId);

    // Cập nhật: Thêm Pageable, đổi List thành Page
    Page<UserVoucherResponse> getAllUserVouchers(Pageable pageable);

    // Cập nhật: Thêm Pageable, đổi List thành Page
    Page<UserVoucherResponse> getAllVouchersByUserId(Long userId, Pageable pageable);

    void removeVoucherFromUser(Long userVoucherId);
}