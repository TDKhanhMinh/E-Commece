"use client";

import React from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { usePayPal } from "@/hooks/use-payment";

interface PayPalProps {
    totalAmountVnd: number;
    orderId: number;
}

export default function PayPalCheckoutButton({
    totalAmountVnd,
    orderId,
}: PayPalProps) {
    const router = useRouter();
    const { createOrderMutation, captureOrderMutation } = usePayPal();

    const EXCHANGE_RATE = 25000;
    const amountInUsd = Number((totalAmountVnd / EXCHANGE_RATE).toFixed(2));

    const initialOptions = {
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
        currency: "USD",
        intent: "capture",
    };

    // 2. Hàm xử lý khởi tạo đơn hàng (Create Order)
    const handleCreateOrder = async () => {
        try {
            const response = await createOrderMutation.mutateAsync(amountInUsd);
            console.log("Response from createOrder:", response);

            const paypalOrderId = response as unknown as string;

            if (!paypalOrderId) {
                throw new Error("Không nhận được mã giao dịch từ hệ thống.");
            }

            return paypalOrderId;
        } catch (error) {
            toast.error("Không thể khởi tạo thanh toán PayPal.");
            throw error;
        }
    };

    // 3. Hàm xử lý khi thanh toán được phê duyệt (Approve)
    const handleApprove = async (data: Record<string, any>) => {
        try {
            toast.info(
                "Đang xử lý giao dịch, vui lòng không đóng trình duyệt..."
            );

            const response = await captureOrderMutation.mutateAsync({
                paypalOrderId: data.orderID,
                orderId: orderId,
            });

            console.log("Response from captureOrder:", response);

            // @ts-ignore
            if (response === "SUCCESS") {
                toast.success("Thanh toán PayPal thành công!");
                router.push(`/user/orders/${orderId}`);
            } else {
                toast.error("Xác nhận thanh toán thất bại.");
            }
        } catch (error) {
            console.error("Lỗi xử lý thanh toán:", error);
        }
    };

    const handleCancel = () => {
        toast.warning("Bạn đã hủy giao dịch PayPal.");
    };

    const handleError = (err: Record<string, any>) => {
        console.error("PayPal Widget Error:", err);
        toast.error(
            "Cổng thanh toán PayPal đang bảo trì hoặc gặp sự cố. Vui lòng thử lại sau."
        );
    };

    return (
        <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons
                style={{ layout: "vertical", shape: "rect", color: "gold" }}
                createOrder={handleCreateOrder}
                onApprove={handleApprove}
                onCancel={handleCancel}
                onError={handleError}
            />
        </PayPalScriptProvider>
    );
}
