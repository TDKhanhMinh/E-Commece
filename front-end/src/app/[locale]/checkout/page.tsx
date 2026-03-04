"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/hooks/use-order";
import { useAuthStore } from "@/store/useAuthStore";
import { CheckoutItemRequest, CheckoutResponse } from "@/type/order-type";
import { useDefaultDeliveryAddress } from "@/hooks/use-delivery-address";
import { toast } from "sonner";
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

export default function CheckoutPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const userId = user?.id ? parseInt(user.id) : 0;
    const checkoutMutation = useCheckout(userId);
    const [shippingMethod, setShippingMethod] = useState("standard");
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [voucherCode, setVoucherCode] = useState<string>("");
    const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
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
                console.log("Loaded checkout data:", parsed);
                setCheckoutData(parsed);
            } catch (error) {
                console.error("Error parsing checkout data:", error);
                toast.error("Không thể tải thông tin đơn hàng");
                router.push("/cart");
            }
        } else {
            toast.error("Không có thông tin đơn hàng");
            router.push("/cart");
        }
    }, [router]);
    const handleApplyVoucher = (code: string) => {
        setVoucherCode(code);
        toast.success(`Đã chọn mã: ${code}`);
        // Tại đây bạn có thể gọi API validate mã giảm giá để cập nhật lại finalAmount
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
        };

        try {
            const response = (await checkoutMutation.mutateAsync(
                requestData
            )) as unknown as CheckoutResponse;

            sessionStorage.removeItem("checkoutData");

            if (response?.orderId) {
                toast.success(
                    `Đặt hàng thành công! Mã đơn hàng: #${response.orderId}`
                );
                router.push(`/user/orders/${response.orderId}`);
            } else {
                router.push("/user/orders");
            }
        } catch (error: any) {
            console.error("Checkout error:", error);
        }
    };

    const handleBackToCart = () => {
        router.push("/cart");
    };

    const handleAddAddress = () => {
        router.push("/user/address-delivery");
    };

    const handleChangeAddress = () => {
        router.push("/user/address-delivery");
    };

    if (!checkoutData || isLoadingAddress) {
        return <CheckoutLoading />;
    }

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8">
            <CheckoutHeader
                onBack={handleBackToCart}
                disabled={checkoutMutation.isPending}
            />

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
                </div>

                <div className="lg:col-span-1">
                    <CheckoutSummaryCard
                        summary={checkoutData.summary}
                        hasAddresses={hasAddresses}
                        isProcessing={checkoutMutation.isPending}
                        onConfirmOrder={handleConfirmOrder}
                        onBackToCart={handleBackToCart}
                    />
                </div>
            </div>
        </div>
    );
}
