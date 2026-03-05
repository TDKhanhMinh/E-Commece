package project.back_end.service;

import project.back_end.entity.UserVoucher;
import project.back_end.response.UserVoucherResponse;

import java.util.List;

public interface UserVoucherService {

    // Lấy tất cả voucher chưa sử dụng trong ví (trả về Response cho FE)
    List<UserVoucherResponse> getAvailableVouchers(Long userId);

    boolean isVoucherOwned(Long userId, Long voucherId);

    // ================= HÀM NỘI BỘ (Helper) =================
    // Trả về Entity để sử dụng logic nội bộ ở các Service khác (như OrderService)
    UserVoucher getUserVoucherEntity(Long userId, String voucherCode);

    void updateUsageStatus(UserVoucher userVoucher);

    // ================= CRUD CHO ADMIN =================

    // Admin cấp phát mã (trả về Response)
    UserVoucherResponse assignVoucherToUser(Long userId, Long voucherId);

    List<UserVoucherResponse> getAllUserVouchers();

    List<UserVoucherResponse> getAllVouchersByUserId(Long userId);

    void removeVoucherFromUser(Long userVoucherId);
}