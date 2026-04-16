export interface WalletTransaction {
  transactionId: number;
  type: 'CREDIT' | 'DEBIT';
  transactionAction: string;
  transactionStatus: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REJECTED';
  amount: string;
  description: string;
  createdAt: string;
}

export interface WalletPaginatedResponse {
  content: WalletTransaction[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  [key: string]: any;
}

export type TransactionType = 'CREDIT' | 'DEBIT';
export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REJECTED';

export interface WithdrawRequest {
  amount: number;
  bankName?: string;
  bankAccountNumber?: string;
  description?: string;
}
