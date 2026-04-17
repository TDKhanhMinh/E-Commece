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
import { useAuthStore } from "@/store/useAuthStore";
import { CartResponse } from "@/type/cart-type";
import { toast } from "sonner";
import { CheckoutData } from "@/components/common/checkout/types";

import { useTranslations } from "next-intl";

export default function CartPage() {
    const t = useTranslations("cart.page");
    const router = useRouter();
    const { data: cartData, isLoading, error } = useCart();
    const cart = cartData as unknown as CartResponse;
    const summary = useCartSummary();
    const updateItem = useUpdateCartItem();
    const removeItem = useRemoveCartItem();
    const clearCart = useClearCart();
    const [checkedItems, setCheckedItems] = useState<number[]>([]);

    const { user, isAuthenticated } = useAuthStore();

    const handleToggleSelected = (skuId: number, checked: boolean) => {
        setCheckedItems((prev) =>
            checked ? [...prev, skuId] : prev.filter((id) => id !== skuId)
        );
    };

    if (isLoading) {
        return <CartLoading />;
    }

    if (error) {
        return <CartError />;
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return <CartEmpty onContinueShopping={() => router.push("/")} />;
    }

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

    const handleCheckout = () => {
        if (!isAuthenticated || !user) {
            toast.error(t("loginRequired"));
            router.push("/login?redirect=/cart");
            return;
        }

        if (checkedItems.length === 0) {
            toast.error(t("selectRequired"));
            return;
        }

        const selectedItems = cart?.items.filter((item) =>
            checkedItems.includes(item.skuId)
        );
        const outOfStockItems = selectedItems?.filter(
            (item) => item.quantity > item.maxStock
        );

        if (outOfStockItems && outOfStockItems.length > 0) {
            toast.error(t("outOfStockError"));
            return;
        }

        const checkoutItems =
            selectedItems?.map((item) => ({
                skuId: item.skuId,
                skuCode: item.skuCode,
                productName: item.productName,
                image: item.image,
                attributes: item.attributes,
                price: item.price,
                salePrice: item.salePrice,
                discountPercent: item.discountPercent,
                quantity: item.quantity,
                subtotal: (item.salePrice ?? item.price) * item.quantity,
            })) || [];

        const checkoutData: CheckoutData = {
            items: checkoutItems,
            pointsDiscount: 0,
            pointsUsed: 0,
            summary: {
                totalAmount: selectedSummary.totalAmount,
                totalDiscount: selectedSummary.totalDiscount,
                finalAmount: selectedSummary.finalAmount,
                totalItems: selectedSummary.totalItems,
            },
        };

        sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData));

        router.push("/checkout");
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
                    isCheckingOut={false}
                    hasSelectedItems={checkedItems.length > 0}
                />
            </div>
        </div>
    );
}
