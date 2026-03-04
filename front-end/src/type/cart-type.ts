// types/cart-type.ts

export interface CartItemRequest {
    skuId: number;
    quantity: number;
}

export interface CartItemResponse {
    id: number;
    skuId: number;
    skuCode: string;
    productName: string;
    attributes: Record<string, string>;
    price: number;
    image: string;
    salePrice: number;
    discountPercent?: number;
    quantity: number;
    subtotal: number;
    inStock: boolean;
    maxStock: number;
    stock: number;
}

export interface CartResponse {
    id?: number;
    userId?: number;
    items: CartItemResponse[];
    totalItems: number;
    subtotal: number; // Đổi từ totalAmount thành subtotal cho khớp use-cart.ts
    discountTotal: number; // Đổi từ totalDiscount thành discountTotal
    totalPrice: number; // Đổi từ finalAmount thành totalPrice
}
