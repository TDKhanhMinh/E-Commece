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
    productImage: string;
    attributes: Record<string, string>;
    price: number;
    salePrice?: number;
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
    totalAmount: number;
    totalDiscount?: number;
    finalAmount: number;
}
