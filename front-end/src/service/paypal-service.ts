import { AxiosResponse } from "axios";
import http from "@/service/http";

/**
 * Gọi Backend để khởi tạo giao dịch PayPal.
 * Backend sẽ trả về Order ID của hệ thống PayPal.
 */
export const createPayPalOrder: (
    amountInUsd: number
) => Promise<AxiosResponse<string>> = async (
    amountInUsd: number
): Promise<AxiosResponse<string>> => {
    return http.post<string>("/paypal/create-order", null, {
        params: { amountInUsd },
    });
};

/**
 * Gọi Backend để thực hiện lệnh thu tiền (capture)
 * sau khi khách hàng đã đồng ý thanh toán trên popup của PayPal.
 */
export const capturePayPalOrder: (
    paypalOrderId: string,
    orderId: number
) => Promise<AxiosResponse<string>> = async (
    paypalOrderId: string,
    orderId: number
): Promise<AxiosResponse<string>> => {
    return http.post<string>("/paypal/capture-order", null, {
        params: { paypalOrderId, orderId },
    });
};
