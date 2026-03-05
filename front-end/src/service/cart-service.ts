import { CartItemRequest, CartResponse } from "@/type/cart-type";
import http from "@/service/http";
import { ApiResponse } from "@/type/api-type";

/**
 * Cart Service - Quản lý giỏ hàng
 * Base URL: /api/cart
 */

// Lấy giỏ hàng hiện tại
export const getCurrentCart = async () =>
    http.get<ApiResponse<CartResponse>>("/cart");

// Thêm sản phẩm vào giỏ hàng
export const addItemToCart = async (data: CartItemRequest) => {
    console.log("Adding item to cart:", data);
    return http.post<ApiResponse<CartResponse>>("/cart/items", data);
};

// Cập nhật số lượng sản phẩm trong giỏ hàng dựa trên SKU_ID
export const updateCartItem = async (skuId: number, quantity: number) => {
    console.log("Updating cart item:", skuId, quantity);
    return http.put<ApiResponse<CartResponse>>(`/cart/items/${skuId}`, {
        quantity,
    });
};

// Xoá một sản phẩm khỏi giỏ hàng dựa trên SKU_ID
export const removeCartItem = async (skuId: number) => {
    console.log("Removing cart item:", skuId);
    return http.delete<ApiResponse<void>>(`/cart/items/${skuId}`);
};

// Hợp nhất giỏ hàng sau khi login (merge guest cart with user cart)
export const mergeCart = async (guestItems: CartItemRequest[]) => {
    console.log("Merging cart with items:", guestItems);
    return http.post<ApiResponse<void>>("/cart/merge", guestItems);
};

// Xoá toàn bộ giỏ hàng
export const clearCart = async () => {
    console.log("Clearing cart");
    return http.delete<ApiResponse<void>>("/cart/clear");
};
