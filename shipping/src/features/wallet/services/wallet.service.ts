import { ApiResponse, PaginatedResponse } from "@/shared";
import { httpClient } from "@api/httpClient";

class WalletService {
    private readonly endpoints = {
        allTransactions: '/wallet/transactions',
    };

    async walletTransaction(): Promise<ApiResponse<PaginatedResponse<any>>> {
        return await httpClient.get(this.endpoints.allTransactions);
    }
}

export const walletService = new WalletService();