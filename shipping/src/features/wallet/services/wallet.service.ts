import { ApiResponse, PaginatedResponse } from "@/shared";
import { httpClient } from "@api/httpClient";
import { WithdrawRequest } from "../types/wallet.types";

class WalletService {
    private readonly endpoints = {
        allTransactions: '/wallet/transactions',
        balance: '/wallet/balance',
        withdraw: '/wallet/withdraw'
    };

    async walletTransaction(): Promise<ApiResponse<PaginatedResponse<any>>> {
        return await httpClient.get(this.endpoints.allTransactions);
    }

    async getBalance(): Promise<ApiResponse<any>> {
        return await httpClient.get(this.endpoints.balance);
    }

    async withdraw(data: WithdrawRequest): Promise<ApiResponse<any>> {
        return await httpClient.post(this.endpoints.withdraw, data);
    }
}

export const walletService = new WalletService();