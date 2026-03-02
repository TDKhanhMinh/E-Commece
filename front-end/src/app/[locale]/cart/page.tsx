"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    useCart,
    useCartSummary,
    useClearCart,
    useRemoveCartItem,
    useUpdateCartItem,
} from "@/hooks/use-cart";
import {
    CartEmpty,
    CartError,
    CartHeader,
    CartItemsList,
    CartLoading,
    CartSummary,
} from "@/components/common/cart";
import { useCheckout } from "@/hooks/use-order";
import { useAuthStore } from "@/store/useAuthStore";
import { CheckoutItemRequest, CheckoutResponse } from "@/type/order-type";
import { CartResponse } from "@/type/cart-type";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function CartPage() {
    const router = useRouter();
    const { data: cartData, isLoading, error } = useCart();
    const cart = cartData as unknown as CartResponse;
    const summary = useCartSummary();
    const updateItem = useUpdateCartItem();
    const removeItem = useRemoveCartItem();
    const clearCart = useClearCart();
    const [checkedItems, setCheckedItems] = useState<number[]>([]);
    const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);

    // Auth state
    const { user, isAuthenticated } = useAuthStore();
    const userId = user?.id ? parseInt(user.id) : 0;
    const checkoutMutation = useCheckout(userId);

    const handleToggleSelected = (skuId: number, checked: boolean) => {
        setCheckedItems((prev) =>
            checked ? [...prev, skuId] : prev.filter((id) => id !== skuId)
        );
    };

    // Handle loading state
    if (isLoading) {
        return <CartLoading />;
    }

    // Handle error state
    if (error) {
        return <CartError onBack={() => router.back()} />;
    }

    // Handle empty cart
    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <CartEmpty
                onBack={() => router.back()}
                onContinueShopping={() => router.push("/")}
            />
        );
    }

    // Handle quantity update
    const handleUpdateQuantity = (
        skuId: number,
        currentQuantity: number,
        delta: number,
        maxStock: number
    ) => {
        const newQuantity = currentQuantity + delta;
        console.log(
            "Updating SKU:",
            skuId,
            "Current:",
            currentQuantity,
            "Delta:",
            delta
        );
        if (newQuantity >= 1 && newQuantity <= maxStock) {
            updateItem.mutate({ skuId, quantity: newQuantity });
        }
    };

    const handleRemoveItem = (skuId: number) => {
        removeItem.mutate(skuId);
    };

    const handleClearCart = () => {
        clearCart.mutate();
    };

    // Handle checkout
    const handleCheckout = () => {
        // Kiểm tra đăng nhập
        if (!isAuthenticated || !user) {
            toast.error("Vui lòng đăng nhập để tiếp tục đặt hàng");
            router.push("/login?redirect=/cart");
            return;
        }

        // Kiểm tra có sản phẩm được chọn không
        if (checkedItems.length === 0) {
            toast.error("Vui lòng chọn ít nhất một sản phẩm để đặt hàng");
            return;
        }

        // Kiểm tra tồn kho
        const selectedItems = cart?.items.filter((item) =>
            checkedItems.includes(item.skuId)
        );
        const outOfStockItems = selectedItems?.filter(
            (item) => item.quantity > item.maxStock
        );

        if (outOfStockItems && outOfStockItems.length > 0) {
            toast.error("Một số sản phẩm đã hết hàng hoặc không đủ số lượng");
            return;
        }

        // Hiển thị dialog xác nhận
        setShowCheckoutDialog(true);
    };

    // Xác nhận checkout
    const handleConfirmCheckout = async () => {
        if (!user?.id) return;

        // Chuyển đổi cart items thành checkout items
        const selectedItems = cart?.items.filter((item) =>
            checkedItems.includes(item.skuId)
        );

        const checkoutItems: CheckoutItemRequest[] =
            selectedItems?.map((item) => ({
                skuId: item.skuId,
                quantity: item.quantity,
            })) || [];

        // TODO: Trong tương lai, cần thêm logic chọn địa chỉ giao hàng
        // Hiện tại hardcode deliveryAddressId = 1
        const deliveryAddressId = 1;

        const checkoutData = {
            deliveryAddressId,
            items: checkoutItems,
        };

        try {
            const response = (await checkoutMutation.mutateAsync(
                checkoutData
            )) as unknown as CheckoutResponse;

            // Đóng dialog
            setShowCheckoutDialog(false);

            // Reset selected items
            setCheckedItems([]);

            // Navigate đến trang order detail hoặc order success
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
    const selectedItems = cart.items.filter((item) =>
        checkedItems.includes(item.skuId)
    );
    const selectedSummary = selectedItems.reduce(
        (acc, item) => {
            const price = item.salePrice ?? item.price;
            const itemTotal = price * item.quantity;
            const originalTotal = item.price * item.quantity;

            acc.totalAmount += originalTotal;
            acc.finalAmount += itemTotal;
            acc.totalDiscount += originalTotal - itemTotal;
            acc.totalItems += item.quantity;

            return acc;
        },
        {
            totalAmount: 0,
            totalDiscount: 0,
            finalAmount: 0,
            totalItems: 0,
        }
    );

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8">
            <CartHeader
                itemCount={summary.itemCount}
                onBack={() => router.back()}
                onClearCart={handleClearCart}
                isClearingCart={clearCart.isPending}
                hasItems={cart.items.length > 0}
            />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <CartItemsList
                    items={cart.items}
                    checkedItems={checkedItems}
                    onToggleSelected={handleToggleSelected}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                    isUpdating={updateItem.isPending}
                    isRemoving={removeItem.isPending}
                />

                <CartSummary
                    totalAmount={selectedSummary.totalAmount}
                    totalDiscount={selectedSummary.totalDiscount}
                    finalAmount={selectedSummary.finalAmount}
                    totalItems={selectedSummary.totalItems}
                    onCheckout={handleCheckout}
                    isCheckingOut={checkoutMutation.isPending}
                    hasSelectedItems={checkedItems.length > 0}
                />
            </div>

            {/* Checkout Confirmation Dialog */}
            <AlertDialog
                open={showCheckoutDialog}
                onOpenChange={setShowCheckoutDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận đặt hàng</AlertDialogTitle>
                        <AlertDialogDescription>
                            <div className="space-y-2">
                                <p>
                                    Bạn đang đặt {selectedSummary.totalItems}{" "}
                                    sản phẩm
                                </p>
                                <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                                    <div className="flex justify-between text-sm">
                                        <span>Tạm tính:</span>
                                        <span>
                                            {selectedSummary.totalAmount.toLocaleString(
                                                "vi-VN"
                                            )}{" "}
                                            ₫
                                        </span>
                                    </div>
                                    {selectedSummary.totalDiscount > 0 && (
                                        <div className="flex justify-between text-sm text-red-600">
                                            <span>Giảm giá:</span>
                                            <span>
                                                -
                                                {selectedSummary.totalDiscount.toLocaleString(
                                                    "vi-VN"
                                                )}{" "}
                                                ₫
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between border-t pt-2 text-lg font-semibold">
                                        <span>Tổng cộng:</span>
                                        <span className="text-primary">
                                            {selectedSummary.finalAmount.toLocaleString(
                                                "vi-VN"
                                            )}{" "}
                                            ₫
                                        </span>
                                    </div>
                                </div>
                                <p className="text-muted-foreground mt-2 text-xs">
                                    * Hiện tại sử dụng địa chỉ giao hàng mặc
                                    định
                                </p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            disabled={checkoutMutation.isPending}
                        >
                            Hủy
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmCheckout}
                            disabled={checkoutMutation.isPending}
                        >
                            {checkoutMutation.isPending
                                ? "Đang xử lý..."
                                : "Xác nhận đặt hàng"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
