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
    paymentUrl?: string;
    paymentMethod?: string;
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
// Định nghĩa thông tin địa chỉ giao hàng
export interface OrderDeliveryAddress {
    userName: string;
    phoneNumber: string;
    location: string;
}

// Định nghĩa thông tin từng sản phẩm trong đơn hàng
export interface OrderItem {
    skuCode: string | number;
    productName: string;
    quantity: number;
    price: number;
    salePrice: number;
    image: string;
}

// Định nghĩa thông tin tổng thể của một chi tiết đơn hàng
export interface OrderDetailResponse {
    orderId: string | number;
    status: string; // VD: "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"
    deliveryAddress: OrderDeliveryAddress;
    items: OrderItem[];

    totalAmount: number;
    finalAmount: number;
    totalDiscount: number;
    shippingCost: number;
    voucherCode?: string;
    voucherDiscount: number;
    productDiscount: number;
    pointsUsed: number;
    pointDiscount: number;

    createdAt: string;
    updatedAt: string;
    confirmedAt: string;
    cancelledAt: string;
    deliveredAt: string;

    paymentMethod?: string;
    shippingMethod?: string;
    deliveryDate?: string;
}
export interface OrderItemData {
    id?: number | string;
    orderId?: string;
    deliveryAddress?: {
        userName?: string;
    };
    createdAt: string;
    finalAmount?: number;
    totalAmount?: number;
    status: string;
    content: [];
    numberOfElements: number;
    totalPages: number;
}
export interface UserOrderItemProps {
    id: string;
    title: string;
    price: string;
    image: string;
    status?: string;
    isCancelling: boolean;
    handleCancelOrder: (orderId: string) => void;
}
