"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    createTransaction,
    getAllTransactionsAdmin,
    getMyTransactions,
    getTransactionById,
} from "@/service/transaction-service";
import { TransactionRequest } from "@/type/transaction-type";

/**
 * 1. Hook lấy danh sách giao dịch cá nhân (Shipper)
 * @param params
 */
export const useMyTransactions = (params?: any) => {
    return useQuery({
        queryKey: ["transactions", "me", params],
        queryFn: async () => {
            return await getMyTransactions(params);
        },
        staleTime: 1000 * 60, // Cache 1 phút
    });
};

/**
 * 2. Hook lấy tất cả giao dịch cho Admin quản lý
 * @param params
 */
export const useTransactionsAdmin = (params?: any) => {
    return useQuery({
        queryKey: ["transactions", "admin", params],
        queryFn: async () => {
            return await getAllTransactionsAdmin(params);
        },
        staleTime: 1000 * 60 * 5, // Cache 5 phút
    });
};

/**
 * 3. Hook lấy chi tiết một giao dịch
 * @param transactionId
 */
export const useTransactionDetail = (transactionId: number) => {
    return useQuery({
        queryKey: ["transactions", "detail", transactionId],
        queryFn: async () => await getTransactionById(transactionId),
        enabled: !!transactionId, // Chỉ chạy khi có ID
    });
};

/**
 * 4. Hook Tạo giao dịch mới (Ví dụ: Yêu cầu rút tiền)
 */
export const useCreateTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: TransactionRequest) => createTransaction(data),
        onSuccess: () => {
            toast.success("Đã gửi yêu cầu giao dịch thành công!");
            // Cập nhật lại danh sách giao dịch ngay lập tức
            queryClient.invalidateQueries({ queryKey: ["transactions", "me"] });
            // Nếu có API lấy số dư ví, cũng cần invalidate nó ở đây
            // queryClient.invalidateQueries({ queryKey: ["wallet", "balance"] });
        },
        onError: (error: any) => {
            const msg = error?.message || "Lỗi khi xử lý giao dịch";
            toast.error(msg);
        },
    });
};
