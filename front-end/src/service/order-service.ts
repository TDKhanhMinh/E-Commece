import {
    CheckoutRequest,
    CheckoutResponse,
    OrderPageResponse,
    OrderResponse,
    OrderSearchParams,
} from "@/type/order-type";
import http, { ApiResponse } from "@/service/http";

/**
 * Order Service - Quản lý đơn hàng
 * Base URL: /api/orders
 */

// Tạo đơn hàng (Checkout)
export const checkout = async (userId: number, data: CheckoutRequest) => {
    console.log("Checkout orders:", data);
    return http.post<ApiResponse<CheckoutResponse>>(
        `/orders/checkout?userId=${userId}`,
        data
    );
};

// Lấy chi tiết đơn hàng theo ID
export const getOrderById = async (
    orderId: string | Array<string> | undefined
) => http.get<ApiResponse<OrderResponse>>(`/orders/${orderId}`);

// Lấy danh sách đơn hàng theo user với pagination
export const getOrdersByUser: (
    arg0: OrderSearchParams | undefined
) => any = async (params?: OrderSearchParams) => {
    const queryParams = new URLSearchParams();

    if (params?.status) {
        queryParams.append("status", params.status);
    }
    if (params?.page !== undefined) {
        queryParams.append("page", params.page.toString());
    }
    if (params?.size !== undefined) {
        queryParams.append("size", params.size.toString());
    }
    if (params?.sort) {
        queryParams.append("sort", params.sort);
    }

    const queryString = queryParams.toString();
    const url = queryString ? `/orders?${queryString}` : "/orders";
    return http.get<ApiResponse<OrderPageResponse>>(url);
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderId: number, status: string) => {
    console.log("Updating orders status:", orderId, status);
    return http.put<ApiResponse<null>>(
        `/orders/${orderId}/status?status=${status}`
    );
};

// Hủy đơn hàng
export const cancelOrder = async (orderId: number) => {
    console.log("Cancelling orders:", orderId);
    return http.delete<ApiResponse<null>>(`/orders/${orderId}`);
};
