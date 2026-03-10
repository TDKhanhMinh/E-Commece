package project.back_end.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import project.back_end.request.ReportRequest;
import project.back_end.response.ApiResponse;
import project.back_end.response.ReportResponse;
import project.back_end.service.ReportService;

@Slf4j
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    /**
     * API lấy dữ liệu tổng hợp cho trang Dashboard Báo cáo
     */
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<ReportResponse>> getDashboardReport(
            @Valid @RequestBody ReportRequest request
    ) {
        log.info("Lấy dữ liệu báo cáo từ ngày {} đến ngày {}", request.getStartDate(), request.getEndDate());

        return ResponseEntity.ok(
                new ApiResponse<>(200, "Lấy dữ liệu báo cáo thành công", reportService.getDashboardReport(request))
        );
    }
}