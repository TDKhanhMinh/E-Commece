import { PageResponse } from "./api-type";

export type TransactionType = "CREDIT" | "DEBIT";
export type TransactionAction = "DELIVERY_FEE" | "BONUS" | "WITHDRAW_TO_BANK" | "PENALTY" | "COD_PAYMENT";
export type TransactionStatus = "PENDING" | "SUCCESS" | "FAILED" | "REJECTED";


// Ánh xạ khớp với JSON của Spring Boot cho wallet transactions
export interface TransactionResponse {
    transactionId: number;
    type: TransactionType;
    transactionAction: TransactionAction;
    transactionStatus: TransactionStatus;
    amount: number;
    description: string | null;
    createdAt: string;
}

// Model dùng khi gửi request POST (nếu cần)
export interface TransactionRequest {
    type: TransactionType;
    transactionAction: TransactionAction;
    amount: number;
    description?: string;
}

// Interface cho Payment Transaction (VNPAY/momo...) dựa trên JSON cung cấp
export interface PaymentTransaction {
    id: number;
    orderId: number;
    userEmail: string;
    transactionCode: string;
    orderReference: string;
    amount: string;
    paymentMethod: string;
    bankCode: string;
    status: string;
    vnpResponseCode: string;
    paymentDate: string;
    createdAt: string;
}

export type PaymentTransactionResponse = PageResponse<PaymentTransaction>;
