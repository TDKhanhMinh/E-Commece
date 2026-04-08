export interface AdminDeliveryResponseDTO {
    deliveryId: number;
    orderId: number;
    customerName: string;
    customerPhone: string;
    destination: string;
    shipperName: string | null;
    codAmount: number;
    paymentStatus: "PAID" | "UNPAID";
    deliveryStatus:
        | "PENDING"
        | "PICKED_UP"
        | "DELIVERING"
        | "SUCCESS"
        | "FAILED"
        | "CANCELLED";
    createdAt: string;
}
