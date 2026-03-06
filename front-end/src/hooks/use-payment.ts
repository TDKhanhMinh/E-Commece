"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import * as paymentService from "@/service/vnpay-service";
import { PaymentRequest } from "@/type/payment-type";
import { toast } from "sonner";
import * as paypalService from "@/service/paypal-service";

export const usePayment = () => {
    const createPaymentUrlMutation = useMutation({
        mutationFn: (data: PaymentRequest) =>
            paymentService.createPaymentUrl(data),
        onSuccess: (response) => {
            const vnpayUrl = response;
            if (vnpayUrl) {
                // @ts-ignore
                window.location.href = vnpayUrl;
            } else {
                toast.error(
                    "Không nhận được đường dẫn thanh toán từ hệ thống."
                );
            }
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi tạo giao dịch thanh toán.");
        },
    });

    const useVerifyPayment = (
        params: Record<string, string>,
        enabled: boolean = true
    ) =>
        useQuery({
            queryKey: ["verifyPayment", params],
            queryFn: async () => {
                return await paymentService.paymentReturn(params);
            },
            enabled: enabled && Object.keys(params).length > 0,
            retry: 0,
            refetchOnWindowFocus: false,
        });

    return {
        createPaymentUrlMutation,
        useVerifyPayment,
    };
};

// 1. Hook Khởi tạo giao dịch PayPal
export const usePayPal = () => {
    const createOrderMutation = useMutation({
        mutationFn: (amountInUsd: number) =>
            paypalService.createPayPalOrder(amountInUsd),
        onError: (error: any) => {
            console.error("Lỗi khi tạo PayPal Order:", error);
            toast.error(
                "Không thể khởi tạo giao dịch PayPal. Vui lòng thử lại!"
            );
        },
    });

    // 2. Hook Xác nhận (Capture) thu tiền
    const captureOrderMutation = useMutation({
        mutationFn: ({
            paypalOrderId,
            orderId,
        }: {
            paypalOrderId: string;
            orderId: number;
        }) => paypalService.capturePayPalOrder(paypalOrderId, orderId),
        onError: (error: any) => {
            console.error("Lỗi khi capture PayPal Order:", error);
            toast.error(
                "Giao dịch xác nhận thất bại hoặc bị từ chối từ phía ngân hàng."
            );
        },
    });

    return {
        createOrderMutation,
        captureOrderMutation,
    };
};
