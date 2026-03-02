/* ======================
 * ORDER STATUS
 * ====================== */
export type OrderStatus =
    | "PENDING"
    | "CONFIRMED"
    | "SHIPPED"
    | "COMPLETED"
    | "CANCELLED";

/* ======================
 * CHECKOUT
 * ====================== */
export interface CheckoutItemRequest {
    skuId: number;
    quantity: number;
}

export interface CheckoutRequest {
    deliveryAddressId: number;
    items: CheckoutItemRequest[];
}

/* ======================
 * CHECKOUT RESPONSE
 * ====================== */
export interface CheckoutResponse {
    orderId: number;
    totalAmount: number;
    totalDiscount: number;
    finalAmount: number;
    totalItems: number;
    status: OrderStatus;
    createdAt: string;
}

/* ======================
 * ORDER ITEM
 * ====================== */
export interface OrderItemResponse {
    skuId: number;
    skuCode: string;
    productName: string;
    image: string;
    price: number;
    salePrice: number;
    quantity: number;
    totalPrice: number;
}

/* ======================
 * DELIVERY ADDRESS
 * ====================== */
export interface OrderDeliveryAddressResponse {
    userName: string;
    phoneNumber: string;
    location: string;
}

/* ======================
 * ORDER RESPONSE
 * ====================== */
export interface OrderResponse {
    orderId: number;
    status: OrderStatus;
    totalAmount: number;
    totalDiscount: number;
    finalAmount: number;
    totalItems: number;
    deliveryAddress: OrderDeliveryAddressResponse;
    items: OrderItemResponse[];
    createdAt: string;
}

/* ======================
 * ORDER PAGE RESPONSE (Pagination)
 * ====================== */
export interface OrderPageResponse {
    content: OrderResponse[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    numberOfElements: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

/* ======================
 * ORDER SEARCH PARAMS
 * ====================== */
export interface OrderSearchParams {
    status?: OrderStatus;
    page?: number;
    size?: number;
    sort?: string;
}
