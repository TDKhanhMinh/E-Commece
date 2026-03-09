"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/hooks/use-order";
import { useAuthStore } from "@/store/useAuthStore";
import { CheckoutItemRequest, CheckoutResponse } from "@/type/order-type";
import { useDefaultDeliveryAddress } from "@/hooks/use-delivery-address";
import { useVoucher } from "@/hooks/use-voucher";
import { toast } from "sonner";

// Các UI Components
import { Button } from "@/components/ui/button"; // <-- Thêm import Button
import {
    CheckoutData,
    CheckoutHeader,
    CheckoutItemsList,
    CheckoutLoading,
    CheckoutSummaryCard,
    DeliveryAddressCard,
} from "@/components/common/checkout";
import { ShippingMethodCard } from "@/components/common/checkout/checkout-shipping-method";
import { PaymentMethodCard } from "@/components/common/checkout/checkout-payment-method";
import { VoucherSelector } from "@/components/common/checkout/checkout-voucher-select";
import { PointSelector } from "@/components/common/checkout/PointSelector";

import { usePayment } from "@/hooks/use-payment";
import PayPalCheckoutButton from "@/components/common/checkout/paypal-checkout-button";

export default function CheckoutPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const userId = user?.id ? parseInt(user.id) : 0;

    const checkoutMutation = useCheckout(userId);
    const { validateVoucher } = useVoucher();
    const { createPaymentUrlMutation } = usePayment();

    // State quản lý việc hiển thị giao diện PayPal
    const [paypalPaymentData, setPaypalPaymentData] = useState<{
        orderId: number;
        amount: number;
    } | null>(null);

    const [shippingMethod, setShippingMethod] = useState("standard");
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [voucherCode, setVoucherCode] = useState<string>("");
    const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);

    // Quản lý các state giảm giá
    const [pointsUsed, setPointsUsed] = useState<number>(0);
    const [pointsDiscount, setPointsDiscount] = useState<number>(0);
    const [voucherDiscount, setVoucherDiscount] = useState<number>(0);

    const {
        defaultAddress,
        isLoading: isLoadingAddress,
        hasAddresses,
    } = useDefaultDeliveryAddress();

    useEffect(() => {
        const data = sessionStorage.getItem("checkoutData");
        if (data) {
            try {
                const parsed = JSON.parse(data);
                setCheckoutData(parsed);
            } catch (error) {
                toast.error("Không thể tải thông tin đơn hàng");
                router.push("/cart");
            }
        } else {
            toast.error("Không có thông tin đơn hàng");
            router.push("/cart");
        }
    }, [router]);

    const handleChangePoints = (points: number, discountValue: number) => {
        setPointsUsed(points);
        setPointsDiscount(discountValue);
    };

    // Áp dụng Voucher
    const handleApplyVoucher = (code: string) => {
        if (!code || !checkoutData) return;

        const orderAmount = checkoutData.summary.finalAmount || 0;

        validateVoucher.mutate(
            { code, orderAmount },
            {
                onSuccess: (voucherData) => {
                    setVoucherCode(code);
                    toast.success(`Đã áp dụng mã: ${code}`);

                    let discountAmount = 0;
                    if (voucherData.discountType === "PERCENTAGE") {
                        discountAmount =
                            (orderAmount * voucherData.discountValue) / 100;
                        if (voucherData.maxDiscount) {
                            discountAmount = Math.min(
                                discountAmount,
                                voucherData.maxDiscount
                            );
                        }
                    } else {
                        discountAmount = voucherData.discountValue;
                    }

                    setVoucherDiscount(discountAmount);
                },
                onError: (error: any) => {
                    const msg =
                        error?.message ||
                        "Mã giảm giá không đủ điều kiện áp dụng";
                    toast.error(msg);
                    setVoucherCode("");
                    setVoucherDiscount(0);
                },
            }
        );
    };

    const handleConfirmOrder = async () => {
        if (!checkoutData || !user?.id) return;

        if (!defaultAddress) {
            toast.error("Vui lòng thêm địa chỉ giao hàng trước khi đặt hàng");
            router.push("/user/address-delivery");
            return;
        }

        const checkoutItems: CheckoutItemRequest[] = checkoutData.items.map(
            (item) => ({
                skuId: item.skuId,
                quantity: item.quantity,
            })
        );

        const requestData = {
            deliveryAddressId: defaultAddress.id,
            items: checkoutItems,
            shippingMethod: shippingMethod,
            paymentMethod: paymentMethod,
            voucherCode: voucherCode || undefined,
            pointsUsed: pointsUsed > 0 ? pointsUsed : undefined,
        };

        try {
            const response = (await checkoutMutation.mutateAsync(
                requestData
            )) as unknown as CheckoutResponse;

            sessionStorage.removeItem("checkoutData");
            console.log("Checkout response:", response);

            if (paymentMethod === "COD" || response?.paymentMethod === "COD") {
                toast.success(
                    `Đặt hàng thành công! Mã đơn hàng: #${response.orderId}`
                );
                router.push(`/user/orders/${response.orderId}`);
            } else if (
                paymentMethod === "VNPAY" ||
                response?.paymentMethod === "VNPAY"
            ) {
                toast.info("Đang khởi tạo giao dịch VNPay, vui lòng đợi...");
                createPaymentUrlMutation.mutate({
                    orderId: response.orderId,
                    amount: response.finalAmount,
                });
            } else if (
                paymentMethod === "PAYPAL" ||
                response?.paymentMethod === "PAYPAL"
            ) {
                toast.info(
                    "Đơn hàng đã được tạo. Vui lòng hoàn tất thanh toán qua PayPal..."
                );
                setPaypalPaymentData({
                    orderId: response.orderId,
                    amount: response.finalAmount,
                });
            } else {
                router.push(`/user/orders/${response.orderId}`);
            }
        } catch (error: any) {
            console.error("Checkout error:", error);
            toast.error("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
        }
    };

    const handleAddAddress = () => router.push("/user/address-delivery");
    const handleChangeAddress = () => router.push("/user/address-delivery");

    if (!checkoutData || isLoadingAddress) {
        return <CheckoutLoading />;
    }

    const shippingFee = shippingMethod === "express" ? 30000 : 0;

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8">
            {paypalPaymentData ? (
                <div className="animate-in fade-in flex flex-col items-center justify-center space-y-6 py-16 duration-500">
                    <div className="space-y-2 text-center">
                        <h2 className="text-3xl font-bold text-slate-800">
                            Thanh toán đơn hàng #{paypalPaymentData.orderId}
                        </h2>
                        <p className="text-slate-600">
                            Vui lòng nhấp vào nút bên dưới để hoàn tất thanh
                            toán an toàn qua PayPal
                        </p>
                    </div>

                    <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-slate-50 p-6 shadow-sm">
                        <PayPalCheckoutButton
                            orderId={paypalPaymentData.orderId}
                            totalAmountVnd={paypalPaymentData.amount}
                        />
                    </div>

                    <Button
                        variant="ghost"
                        className="text-slate-500 underline hover:text-slate-800"
                        onClick={() =>
                            router.push(
                                `/user/orders/${paypalPaymentData.orderId}`
                            )
                        }
                    >
                        Thanh toán sau (Quản lý đơn hàng)
                    </Button>
                </div>
            ) : (
                /* NẾU KHÔNG: HIỂN THỊ GIAO DIỆN CHECKOUT BÌNH THƯỜNG */
                <>
                    <CheckoutHeader />

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            <DeliveryAddressCard
                                hasAddresses={hasAddresses}
                                defaultAddress={defaultAddress}
                                onAddAddress={handleAddAddress}
                                onChangeAddress={handleChangeAddress}
                            />

                            <CheckoutItemsList items={checkoutData.items} />
                            <ShippingMethodCard
                                value={shippingMethod}
                                onValueChange={setShippingMethod}
                            />
                            <PaymentMethodCard
                                value={paymentMethod}
                                onValueChange={setPaymentMethod}
                            />
                            <VoucherSelector
                                onApplyVoucher={handleApplyVoucher}
                                appliedVoucher={voucherCode}
                            />
                            <PointSelector
                                totalAmount={
                                    checkoutData.summary.finalAmount || 0
                                }
                                onPointsChange={handleChangePoints}
                            />
                        </div>

                        <div className="lg:col-span-1">
                            <CheckoutSummaryCard
                                summary={checkoutData.summary}
                                hasAddresses={hasAddresses}
                                isProcessing={checkoutMutation.isPending}
                                voucherDiscount={voucherDiscount}
                                pointsDiscount={pointsDiscount}
                                shippingFee={shippingFee}
                                onConfirmOrder={handleConfirmOrder}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
