package project.back_end.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.back_end.entity.KpiProjection;
import project.back_end.enumerate.OrderStatus;
import project.back_end.repository.OrderItemRepository;
import project.back_end.repository.OrderRepository;
import project.back_end.request.ReportRequest;
import project.back_end.response.ReportResponse;
import project.back_end.service.ReportService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    @Override
    @Transactional(readOnly = true)
    public ReportResponse getDashboardReport(ReportRequest request) {

        // 1. Xử lý thời gian (Date Range)
        LocalDateTime startDateTime = request.getStartDate().atStartOfDay();
        // Ngày kết thúc: 23:59:59.999999999
        LocalDateTime endDateTime = request.getEndDate().atTime(LocalTime.MAX);

        // 2. Lấy dữ liệu KPI
        ReportResponse.KpiMetrics kpis = getKpiMetrics(startDateTime, endDateTime);

        // 3. Lấy dữ liệu Biểu đồ
        List<ReportResponse.RevenueChartItem> chartItems = getChartData(startDateTime, endDateTime);

        // 4. Lấy danh sách Top Sản phẩm
        List<ReportResponse.TopProductItem> topProducts = getTopProducts(startDateTime, endDateTime, kpis.getTotalRevenue());

        // 5. Build và trả về
        return ReportResponse.builder()
                .kpis(kpis)
                .revenueChart(chartItems)
                .topProducts(topProducts)
                .build();
    }

    /* CÁC HÀM PRIVATE HỖ TRỢ (GIÚP CODE MAIN NGẮN GỌN HƠN)*/

    private ReportResponse.KpiMetrics getKpiMetrics(LocalDateTime start, LocalDateTime end) {
        KpiProjection projection = orderRepository.getRevenueAndOrderCount(start, end);

        // 2. Lấy dữ liệu an toàn (Xử lý trường hợp DB trả về null)
        BigDecimal totalRevenue = (projection != null && projection.getTotalRevenue() != null)
                ? projection.getTotalRevenue() : BigDecimal.ZERO;
        long successfulOrders = (projection != null && projection.getOrderCount() != null)
                ? projection.getOrderCount() : 0L;

        // 3. Tính trung bình
        BigDecimal averageOrderValue = BigDecimal.ZERO;
        if (successfulOrders > 0) {
            averageOrderValue = totalRevenue.divide(BigDecimal.valueOf(successfulOrders), 2, RoundingMode.HALF_UP);
        }

        long canceledOrders = orderRepository.countByStatusAndCreatedAtBetween(OrderStatus.CANCELLED, start, end);

        return ReportResponse.KpiMetrics.builder()
                .totalRevenue(totalRevenue)
                .successfulOrders(successfulOrders)
                .averageOrderValue(averageOrderValue)
                .conversionRate(successfulOrders > 0 ? (double) successfulOrders / (successfulOrders + canceledOrders) * 100 : 0.0)
                .build();
    }

    private List<ReportResponse.RevenueChartItem> getChartData(LocalDateTime start, LocalDateTime end) {
        List<Object[]> rawData = orderRepository.getRevenueChartData(start, end);

        return rawData.stream().map(row -> {
            String dateString = row[0].toString();
            BigDecimal revenue = row[1] != null ? (BigDecimal) row[1] : BigDecimal.ZERO;

            return ReportResponse.RevenueChartItem.builder()
                    .date(dateString)
                    .revenue(revenue)
                    .build();
        }).collect(Collectors.toList());
    }

    private List<ReportResponse.TopProductItem> getTopProducts(LocalDateTime start, LocalDateTime end, BigDecimal totalRevenue) {
        // Limit: Chỉ lấy Top 5 sản phẩm
        Pageable top5 = PageRequest.of(0, 5);
        List<Object[]> rawData = orderItemRepository.getTopSellingProducts(start, end, top5);

        return rawData.stream().map(row -> {
            String productName = (String) row[0]; //
            Long totalSales = (Long) row[1];
            BigDecimal productRevenue = row[2] != null ? (BigDecimal) row[2] : BigDecimal.ZERO;

            // Tính tỷ lệ % đóng góp (Product Revenue / Total Revenue * 100)
            double percentage = 0.0;
            if (totalRevenue.compareTo(BigDecimal.ZERO) > 0) {
                percentage = productRevenue
                        .multiply(new BigDecimal("100"))
                        .divide(totalRevenue, 2, RoundingMode.HALF_UP)
                        .doubleValue();
            }

            return ReportResponse.TopProductItem.builder()
                    .productName(productName)
                    .totalSales(totalSales)
                    .totalRevenue(productRevenue)
                    .percentage(percentage)
                    .build();
        }).collect(Collectors.toList());
    }
}