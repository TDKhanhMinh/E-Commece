package project.back_end.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {

    // 1. Dữ liệu cho 4 thẻ KPI trên cùng
    private KpiMetrics kpis;

    // 2. Dữ liệu cho biểu đồ doanh thu
    private List<RevenueChartItem> revenueChart;

    // 3. Dữ liệu cho danh sách Top sản phẩm
    private List<TopProductItem> topProducts;

    /* CÁC LỚP DTO CON (NESTED CLASSES) */

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class KpiMetrics {
        private BigDecimal totalRevenue;       // Tổng doanh thu
        private Long successfulOrders;         // Đơn hàng thành công
        private BigDecimal averageOrderValue;  // Giá trị đơn trung bình
        private Double conversionRate;         // Tỷ lệ chốt đơn (%)

    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RevenueChartItem {
        private String date;             // Ngày hiển thị trên trục X (VD: "01/03")
        private BigDecimal revenue;      // Doanh thu tương ứng trên trục Y
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopProductItem {
        private String productName;      // Tên sản phẩm hiển thị
        private Long totalSales;         // Số lượng đã bán
        private BigDecimal totalRevenue; // Tiền mang lại từ sản phẩm này
        private Double percentage;       // % đóng góp vào tổng doanh thu
    }
}