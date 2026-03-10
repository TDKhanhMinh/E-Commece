import http from "@/service/http";
import { ApiResponse } from "@/type/api-type";
import { ReportRequest, ReportResponse } from "@/type/reports-type";

export const getReportsAndAnalytics = async (data: ReportRequest) =>
    http.post<ApiResponse<ReportResponse>>("/reports", data);
