import { AxiosResponse } from "axios";
import http from "@/service/http";
import { PaymentRequest } from "@/type/payment-type";

/**
 * Gọi Backend để tạo URL thanh toán VNPay bằng phương thức POST.
 * Dữ liệu params được đưa vào Body để bảo mật thông tin.
 */
export const createPaymentUrl: (
    data: PaymentRequest
) => Promise<AxiosResponse<string>> = async (
    data: PaymentRequest
): Promise<AxiosResponse<string>> => {
    return http.post<string>("/vnpay/create", data);
};
/**
 * Gọi Backend để kiểm tra kết quả giao dịch sau khi người dùng thanh toán xong
 * và được VNPay redirect về trang web của bạn.
 */
export const paymentReturn: (
    params: Record<string, string>
) => Promise<AxiosResponse<string>> = async (
    params: Record<string, string>
): Promise<AxiosResponse<string>> => {
    return http.get<string>("/vnpay/vnpay-return", { params });
};

// ================= LƯU Ý VỀ IPN =================
// Endpoint "/vnpay-ipn" là dành cho kết nối Server-to-Server (VNPay gọi trực tiếp vào Backend của bạn).
// Frontend tuyệt đối KHÔNG gọi endpoint này, do đó chúng ta không viết hàm service cho IPN ở đây.
