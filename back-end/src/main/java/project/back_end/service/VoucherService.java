package project.back_end.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import project.back_end.request.VoucherRequest.VoucherRequest;
import project.back_end.response.UserVoucherResponse;
import project.back_end.response.VoucherResponse;

@Service
public interface VoucherService {
    // Lưu voucher vào kho của người dùng khi họ nhấn "Lưu" hoặc "Thu thập"
    void collectVoucher(Long userId, String voucherCode);

    /// Lấy danh sách voucher chưa sử dụng để hiển thị lên Popover ở FE
    Page<UserVoucherResponse> getUserVoucherWallet(Long userId, Pageable pageable);

    // Kiểm tra và trả về thông tin Voucher nếu hợp lệ với đơn hàng hiện tại
    VoucherResponse validateVoucher(Long userId, String code, Double orderAmount);

    // Đánh dấu voucher đã được sử dụng sau khi đặt hàng thành công
    void markVoucherAsUsed(Long userId, String code);

    // Tạo mới một voucher
    VoucherResponse createVoucher(VoucherRequest request);

    // Lấy danh sách tất cả voucher trong hệ thống
    Page<VoucherResponse> getAllVouchers(Pageable pageable);

    // Lấy chi tiết một voucher theo ID
    VoucherResponse getVoucherById(Long id);

    // Cập nhật thông tin voucher
    VoucherResponse updateVoucher(Long id, VoucherRequest request);

    // Xóa voucher (Soft Delete)
    void disableVoucher(Long id, Boolean action);
}