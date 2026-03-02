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

export default function CheckoutPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const userId = user?.id ? parseInt(user.id) : 0;
    const checkoutMutation = useCheckout(userId);

    const {
        defaultAddress,
        isLoading: isLoadingAddress,
        hasAddresses,
    } = useDefaultDeliveryAddress();

    const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);

    useEffect(() => {
        // Lấy dữ liệu từ sessionStorage
        const data = sessionStorage.getItem("checkoutData");
        if (data) {
            try {
                const parsed = JSON.parse(data);
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

    const handleConfirmOrder = async () => {
        if (!checkoutData || !user?.id) return;

        // Kiểm tra địa chỉ giao hàng
        if (!defaultAddress) {
            toast.error("Vui lòng thêm địa chỉ giao hàng trước khi đặt hàng");
            router.push("/user/address-delivery");
            return;
        }

        // Chuyển đổi sang format backend
        const checkoutItems: CheckoutItemRequest[] = checkoutData.items.map(
            (item) => ({
                skuId: item.skuId,
                quantity: item.quantity,
            })
        );

        const requestData = {
            deliveryAddressId: defaultAddress.id,
            items: checkoutItems,
        };

        try {
            const response = (await checkoutMutation.mutateAsync(
                requestData
            )) as unknown as CheckoutResponse;

            // Xóa dữ liệu checkout khỏi sessionStorage
            sessionStorage.removeItem("checkoutData");

            // Navigate đến trang order detail
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
            // Toast error đã được handle trong hook
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

    // Loading state
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
                {/* Cột trái: Thông tin đơn hàng */}
                <div className="space-y-6 lg:col-span-2">
                    <DeliveryAddressCard
                        hasAddresses={hasAddresses}
                        defaultAddress={defaultAddress}
                        onAddAddress={handleAddAddress}
                        onChangeAddress={handleChangeAddress}
                    />

                    <CheckoutItemsList items={checkoutData.items} />
                </div>

                {/* Cột phải: Tóm tắt đơn hàng */}
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
