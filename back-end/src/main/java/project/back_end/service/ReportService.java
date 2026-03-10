package project.back_end.service;


import project.back_end.request.ReportRequest;
import project.back_end.response.ReportResponse;

public interface ReportService {

    /**
     * Lấy báo cáo tổng hợp cho Dashboard (KPI, Chart, Top Products)
     *
     * @param request Chứa ngày bắt đầu và ngày kết thúc
     * @return DashboardReportResponse
     */
    ReportResponse getDashboardReport(ReportRequest request);
}