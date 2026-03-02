// Shared types for checkout components
export interface CheckoutItem {
    skuId: number;
    skuCode: string;
    productName: string;
    image: string;
    attributes: Record<string, string>;
    price: number;
    salePrice?: number;
    discountPercent?: number;
    quantity: number;
    subtotal: number;
}

export interface CheckoutData {
    items: CheckoutItem[];
    summary: {
        totalAmount: number;
        totalDiscount: number;
        finalAmount: number;
        totalItems: number;
    };
}
