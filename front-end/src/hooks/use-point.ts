"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as pointService from "@/service/point-service";
import {
    PointAdjustmentRequest,
    PointHistoryResponse,
    UserPointSummaryResponse,
} from "@/type/point-type";
import { PageResponse } from "@/type/api-type";

/**
 * Hook tổng hợp quản lý toàn bộ hệ thống Điểm và Hạng thành viên (User & Admin)
 */
export const usePoints = () => {
    const queryClient = useQueryClient();

    // ==========================================
    // 1. DÀNH CHO NGƯỜI DÙNG (USER)
    // ==========================================

    // Lấy tổng hợp điểm và hạng thành viên
    const useMyPointSummary = () =>
        useQuery({
            queryKey: ["pointSummary"],
            queryFn: async () => {
                const response = await pointService.getMyPointSummary();
                return response as unknown as UserPointSummaryResponse;
            },
            staleTime: 1000 * 60 * 5, // Cache dữ liệu trong 5 phút giống như voucher
        });

    // Lấy lịch sử biến động điểm (có phân trang)
    const useMyPointHistory = (
        userId: number,
        page: number = 0,
        size: number = 10
    ) =>
        useQuery({
            queryKey: ["pointHistory", userId, page, size],
            queryFn: async () => {
                const response = await pointService.getMyPointHistory(
                    userId,
                    page,
                    size
                );
                return response as unknown as PageResponse<PointHistoryResponse>;
            },
            enabled: !!userId,
        });

    // Sử dụng điểm (đổi quà, giảm giá)
    const redeemPointsMutation = useMutation({
        mutationFn: ({ userId, points }: { userId: number; points: number }) =>
            pointService.redeemPoints(userId, points),
        onSuccess: (_, variables) => {
            // Cập nhật lại số dư điểm và lịch sử ngay lập tức sau khi dùng điểm thành công
            queryClient.invalidateQueries({
                queryKey: ["pointSummary", variables.userId],
            });
            queryClient.invalidateQueries({
                queryKey: ["pointHistory", variables.userId],
            });
        },
    });

    // ==========================================
    // 2. DÀNH CHO QUẢN TRỊ VIÊN (ADMIN)
    // ==========================================

    const adminPointActions = {
        // Điều chỉnh điểm thủ công
        adjust: useMutation({
            mutationFn: (data: PointAdjustmentRequest) =>
                pointService.adjustPoints(data),
            onSuccess: (_, variables) => {
                // Cập nhật lại dữ liệu của chính user vừa bị/được admin điều chỉnh điểm
                queryClient.invalidateQueries({
                    queryKey: ["pointSummary", variables.userId],
                });
                queryClient.invalidateQueries({
                    queryKey: ["pointHistory", variables.userId],
                });
            },
        }),
    };

    return {
        // User exports
        useMyPointSummary,
        useMyPointHistory,
        redeemPointsMutation,

        // Admin exports
        adminPointActions,
    };
};
