import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { walletService } from "../services/wallet.service";
import { WalletPaginatedResponse, WithdrawRequest } from "../types/wallet.types";

export function useWalletTransaction() {
    return useQuery<WalletPaginatedResponse>({
        queryKey: ['wallet', 'transactions', 'balance'],
        queryFn: async () => {
            const response = await walletService.walletTransaction();
            console.log("response data", response.data.data);

            if (response.success && response.data) {
                return response.data.data as unknown as WalletPaginatedResponse;
            }
            throw new Error(response.error || 'Failed to fetch wallet transactions');
        },
    });
}

export function useBalance() {
    return useQuery({
        queryKey: ['wallet', 'balance'],
        queryFn: async () => {
            const response = await walletService.getBalance();
            console.log("res balance", response.data.data);

            if (response.success && response.data) {
                return response.data.data;
            }
            throw new Error(response.error || 'Failed to fetch balance');
        },
    });
}

export function useWithdraw() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: WithdrawRequest) => {
            const response = await walletService.withdraw(data);
            if (response.success && response.data) {
                return response.data;
            }
            throw new Error(response.error || 'Rút tiền thất bại');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wallet', 'balance'] });
            queryClient.invalidateQueries({ queryKey: ['wallet', 'transactions'] });
        },
        onError: (error) => {
            console.log('Withdraw error', error);
        },
    });
}

