export interface AdminDeliveryResponseDTO {
    deliveryId: number;
    orderId: number;
    customerName: string;
    customerPhone: string;
    destination: string;
    shipperProfile: {
        fullName: string;
    };
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
