import { ApiResponse, PaginatedResponse } from "@/shared";
import { httpClient } from "@api/httpClient";

class WalletService {
    private readonly endpoints = {
        allTransactions: '/wallet/transactions',
        balance: '/wallet/balance'
    };

    async walletTransaction(): Promise<ApiResponse<PaginatedResponse<any>>> {
        return await httpClient.get(this.endpoints.allTransactions);
    }

    async getBalance(): Promise<ApiResponse<any>> {
        return await httpClient.get(this.endpoints.balance);
    }
}

export const walletService = new WalletService();