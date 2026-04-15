// type/transaction-type.ts

export type TransactionType = "CREDIT" | "DEBIT";
export type TransactionAction = "DELIVERY_FEE" | "WITHDRAW" | "DEPOSIT";
export type TransactionStatus = "PENDING" | "SUCCESS" | "FAILED";

// Ánh xạ khớp với JSON của Spring Boot
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
