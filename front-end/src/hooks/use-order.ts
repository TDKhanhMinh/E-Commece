"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    cancelOrder,
    checkout,
    getOrderById,
    getOrdersByUser,
    updateOrderStatus,
} from "@/service/order-service";
import { CheckoutRequest, OrderSearchParams } from "@/type/order-type";
import { toast } from "sonner";

// ==========================================
// 1. QUERY HOOKS (GET DATA)
// ==========================================

/**
 * Hook lấy chi tiết đơn hàng theo ID
 * @param orderId ID đơn hàng
 */
export const useOrderDetail = (orderId: string | Array<string> | undefined) => {
    return useQuery({
        queryKey: ["order", orderId],
        queryFn: async () => {
            return await getOrderById(orderId);
        },
        enabled: !!orderId,
        staleTime: 1000 * 60,
    });
};

/**
 * Hook lấy danh sách đơn hàng theo user với pagination
 * @param params Search params (status, page, size, sort)
 */
export const useOrdersByUser = (params?: OrderSearchParams) => {
    return useQuery({
        queryKey: ["orders", "user", params],
        queryFn: async () => {
            return await getOrdersByUser(params);
        },
        staleTime: 1000 * 60, // 1 phút
    });
};

// ==========================================
// 2. MUTATION HOOKS (CREATE/UPDATE/DELETE)
// ==========================================

/**
 * Hook tạo đơn hàng (Checkout)
 * - Invalidate cart và orders sau khi thành công
 * - Hiển thị toast notification
 */
export const useCheckout = (userId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CheckoutRequest) => checkout(userId, data),
        onSuccess: (response) => {
            toast.success("Đặt hàng thành công!");
            queryClient.invalidateQueries({
                queryKey: ["orders", "user"],
            });
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (error: any) => {
            const msg = error?.message || "Không thể đặt hàng";
            toast.error(msg);
        },
    });
};

/**
 * Hook cập nhật trạng thái đơn hàng
 * - Admin hoặc User có thể update status
 */
export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            orderId,
            status,
        }: {
            orderId: number;
            status: string;
        }) => updateOrderStatus(orderId, status),
        onSuccess: (data, variables) => {
            toast.success("Cập nhật trạng thái đơn hàng thành công!");
            // Invalidate user orders list
            queryClient.invalidateQueries({
                queryKey: ["orders", "user"],
            });
            // Invalidate admin orders list
            queryClient.invalidateQueries({
                queryKey: ["admin-orders"],
            });
            // Invalidate specific order detail
            queryClient.invalidateQueries({
                queryKey: ["order", variables.orderId],
            });
        },
        onError: (error: any) => {
            const msg =
                error?.message || "Không thể cập nhật trạng thái đơn hàng";
            toast.error(msg);
        },
    });
};

/**
 * Hook hủy đơn hàng
 * - User hoặc Admin có thể hủy
 */
export const useCancelOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (orderId: number) => cancelOrder(orderId),
        onSuccess: () => {
            toast.success("Đã hủy đơn hàng!");
            queryClient.invalidateQueries({
                queryKey: ["orders", "user"],
            });
        },
        onError: (error: any) => {
            const msg = error?.message || "Không thể hủy đơn hàng";
            toast.error(msg);
        },
    });
};
