import { useQuery } from "@tanstack/react-query";
import { walletService } from "../services/wallet.service";
import { WalletPaginatedResponse } from "../types/wallet.types";

export function useWalletTransaction() {
    return useQuery<WalletPaginatedResponse>({
        queryKey: ['wallet', 'transactions'],
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

