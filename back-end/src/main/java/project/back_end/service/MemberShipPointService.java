package project.back_end.service;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import project.back_end.entity.PointTransactionType;
import project.back_end.response.MemberShipPointHistoryResponse;
import project.back_end.response.UserPointSummaryResponse;

public interface MemberShipPointService {
    // Cộng hoặc trừ điểm của người dùng và ghi lại lịch sử
    void managePoints(Long userId, Long amount, PointTransactionType type, Long referenceId, String description);

    // Lấy lịch sử điểm của một người dùng (phân trang)
    Page<MemberShipPointHistoryResponse> getPointHistory(Long userId, Pageable pageable);

    // Lấy thông tin số dư điểm và hạng hiện tại của người dùng
    UserPointSummaryResponse getUserPointInfo(String email);

    void redeemPoints(Long userId, Long amount, Long referenceId, String description);
}
