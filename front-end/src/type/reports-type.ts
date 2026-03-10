export interface KpiMetrics {
    totalRevenue: number;
    successfulOrders: number;
    averageOrderValue: number;
    conversionRate: number;
}

export interface RevenueChartItem {
    date: string;
    revenue: number;
}

export interface TopProductItem {
    productName: string;
    totalSales: number;
    totalRevenue: number;
    percentage: number;
}

export interface ReportResponse {
    kpis: KpiMetrics;
    revenueChart: RevenueChartItem[];
    topProducts: TopProductItem[];
}
export interface ReportRequest {
    startDate: string;
    endDate: string;
}
