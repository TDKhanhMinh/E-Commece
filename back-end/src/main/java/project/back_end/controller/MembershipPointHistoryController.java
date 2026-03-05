package project.back_end.controller;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import project.back_end.request.PointAdjustmentRequest;
import project.back_end.response.ApiResponse;
import project.back_end.response.MemberShipPointHistoryResponse;
import project.back_end.response.UserPointSummaryResponse;
import project.back_end.service.MemberShipPointService;

@RestController
@RequestMapping("/api/points")
@RequiredArgsConstructor
public class MembershipPointHistoryController {


    private final MemberShipPointService pointService;

    // ==========================================
    // DÀNH CHO NGƯỜI DÙNG (USER)
    // ==========================================

    /**
     * Lấy tổng hợp điểm và hạng thành viên của người dùng hiện tại
     */
    @GetMapping("/my-summary")
    public ResponseEntity<ApiResponse<UserPointSummaryResponse>> getMyPointSummary(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();

        return ResponseEntity.ok(
                new ApiResponse<>(200, "Lấy thông tin điểm thành công", pointService.getUserPointInfo(email))
        );
    }

    /**
     * Lấy lịch sử biến động điểm của người dùng (có phân trang)
     */
    @GetMapping("/my-history")
    public ResponseEntity<ApiResponse<Page<MemberShipPointHistoryResponse>>> getMyPointHistory(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        // Sắp xếp mặc định là ngày tạo mới nhất lên đầu
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Lấy lịch sử điểm thành công", pointService.getPointHistory(userId, pageable))
        );
    }

    // ==========================================
    // DÀNH CHO QUẢN TRỊ VIÊN (ADMIN)
    // ==========================================

    /**
     * Admin điều chỉnh điểm thủ công (Cộng thưởng hoặc Trừ phạt)
     */
    @PostMapping("/admin/adjust")
    public ResponseEntity<ApiResponse<String>> adjustPoints(@RequestBody @Valid PointAdjustmentRequest request) {
        pointService.managePoints(
                request.getUserId(),
                request.getAmount(),
                request.getType(),
                null,
                request.getDescription()
        );
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Điều chỉnh điểm thành công", null)
        );
    }
}