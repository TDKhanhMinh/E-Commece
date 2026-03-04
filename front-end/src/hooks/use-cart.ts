"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    addItemToCart,
    clearCart,
    getCurrentCart,
    mergeCart,
    removeCartItem,
    updateCartItem,
} from "@/service/cart-service";

import { CartItemRequest } from "@/type/cart-type";
import { toast } from "sonner";

// ==========================================
// 1. QUERY HOOKS (GET DATA)
// ==========================================

/**
 * Hook lấy giỏ hàng hiện tại
 * - Tự động fetch khi component mount
 * - Cache data với queryKey ["cart"]
 */
export const useCart = () => {
    return useQuery({
        queryKey: ["cart"],
        queryFn: async () => {
            return await getCurrentCart();
        },
        staleTime: 1000 * 30,
        retry: 1,
    });
};

// ==========================================
// 2. MUTATION HOOKS (ADD/UPDATE/DELETE)
// ==========================================

/**
 * Hook thêm sản phẩm vào giỏ hàng
 * - Invalidate cart query sau khi thành công
 * - Hiển thị toast notification
 */
export const useAddToCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CartItemRequest) => addItemToCart(data),
        onSuccess: () => {
            toast.success("Đã thêm sản phẩm vào giỏ hàng!");
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (error: any) => {
            const msg = error.message || "Không thể thêm sản phẩm vào giỏ hàng";
            toast.error(msg);
        },
    });
};

/**
 * Hook cập nhật số lượng sản phẩm trong giỏ hàng
 * - Cập nhật dựa trên SKU ID
 */
/**
 * Hook cập nhật số lượng sản phẩm trong giỏ hàng
 */
export const useUpdateCartItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        // Thay vì viết: ({ skuId, quantity }: { skuId: number; quantity: number; })
        // Bạn có thể rút gọn lại bằng CartItemRequest như sau:
        mutationFn: (data: CartItemRequest) =>
            updateCartItem(data.skuId, data.quantity),
        onSuccess: () => {
            toast.success("Cập nhật giỏ hàng thành công!");
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (error: any) => {
            const msg = error.message || "Không thể cập nhật giỏ hàng";
            toast.error(msg);
        },
    });
};

/**
 * Hook xóa sản phẩm khỏi giỏ hàng
 * - Xóa dựa trên SKU ID
 */
export const useRemoveCartItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (skuId: number) => removeCartItem(skuId),
        onSuccess: () => {
            toast.success("Đã xóa sản phẩm khỏi giỏ hàng!");
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (error: any) => {
            const msg = error.message || "Không thể xóa sản phẩm";
            toast.error(msg);
        },
    });
};

/**
 * Hook hợp nhất giỏ hàng (Guest → User)
 * - Dùng sau khi login để merge giỏ hàng guest với user
 */
export const useMergeCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (guestItems: CartItemRequest[]) => mergeCart(guestItems),
        onSuccess: () => {
            toast.success("Đã hợp nhất giỏ hàng!");
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (error: any) => {
            const msg = error.message || "Không thể hợp nhất giỏ hàng";
            toast.error(msg);
        },
    });
};

/**
 * Hook xóa toàn bộ giỏ hàng
 * - Clear tất cả items
 */
export const useClearCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => clearCart(),
        onSuccess: () => {
            toast.success("Đã xóa toàn bộ giỏ hàng!");
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (error: any) => {
            const msg = error.message || "Không thể xóa giỏ hàng";
            toast.error(msg);
        },
    });
};

// ==========================================
// 3. HELPER HOOKS (COMPUTED VALUES)
// ==========================================

/**
 * Hook tính toán thông tin tổng hợp của giỏ hàng
 * - Tổng số items
 * - Tổng tiền
 * - Số lượng sản phẩm
 */
export const useCartSummary = () => {
    const { data: cart, isLoading } = useCart();

    if (isLoading || !cart) {
        return {
            totalItems: 0,
            totalAmount: 0,
            finalAmount: 0,
            totalDiscount: 0,
            itemCount: 0,
        };
    }

    return {
        totalItems: cart.totalItems || 0,
        totalAmount: cart.subtotal || 0,
        finalAmount: cart.totalPrice || 0,
        totalDiscount: cart.discountTotal || 0,
        itemCount: cart.items?.length || 0,
    };
};
