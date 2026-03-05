import { AxiosResponse } from "axios";
import http from "@/service/http";
import {
    PointAdjustmentRequest,
    PointHistoryResponse,
    UserPointSummaryResponse,
} from "@/type/point-type";
import { PageResponse } from "@/type/api-type";

// ================= API CHO NGƯỜI DÙNG =================

/**
 * Lấy tổng hợp điểm và hạng thành viên của người dùng hiện tại
 */
export const getMyPointSummary: () => Promise<
    AxiosResponse<UserPointSummaryResponse>
> = async (): Promise<AxiosResponse<UserPointSummaryResponse>> => {
    return http.get<UserPointSummaryResponse>("/points/my-summary");
};

/**
 * Lấy lịch sử biến động điểm (có phân trang)
 */
export const getMyPointHistory: (
    userId: number,
    page: number,
    size: number
) => Promise<AxiosResponse<PageResponse<PointHistoryResponse>>> = async (
    userId,
    page,
    size
): Promise<AxiosResponse<PageResponse<PointHistoryResponse>>> => {
    return http.get<PageResponse<PointHistoryResponse>>("/points/my-history", {
        params: { userId, page, size },
    });
};

/**
 * Sử dụng điểm tích lũy
 */
export const redeemPoints: (
    userId: number,
    points: number
) => Promise<AxiosResponse<string>> = async (
    userId,
    points
): Promise<AxiosResponse<string>> => {
    return http.post<string>("/points/redeem", null, {
        params: { userId, points },
    });
};

// ================= API CHO ADMIN =================

/**
 * Admin điều chỉnh điểm thủ công cho người dùng
 */
export const adjustPoints: (
    data: PointAdjustmentRequest
) => Promise<AxiosResponse<string>> = async (
    data: PointAdjustmentRequest
): Promise<AxiosResponse<string>> => {
    return http.post<string>("/points/admin/adjust", data);
};
