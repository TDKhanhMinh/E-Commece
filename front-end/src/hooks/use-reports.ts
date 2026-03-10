import { useQuery } from "@tanstack/react-query";
import { getReportsAndAnalytics } from "@/service/reports-service";
import { ReportRequest } from "@/type/reports-type";

/**
 * Hook lấy dữ liệu Báo cáo & Phân tích
 * @param params { startDate, endDate }
 * @param enabled (Tùy chọn) Điều kiện để cho phép gọi API (mặc định là true)
 */
export const useReportsAndAnalytics = (
    params: ReportRequest,
    enabled: boolean = true
) => {
    return useQuery({
        queryKey: ["reports", "analytics", params.startDate, params.endDate],
        queryFn: async () => {
            return await getReportsAndAnalytics(params);
        },
        staleTime: 1000 * 60 * 5,
        enabled: enabled && !!params.startDate && !!params.endDate,
        placeholderData: (previousData) => previousData,
    });
};
