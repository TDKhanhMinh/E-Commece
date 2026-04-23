"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    createTransaction,
    getAllTransactionsAdmin,
    getAllTransactionsPaymentAdmin,
    getMyTransactions,
    updateTransactionStatus,
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
 * 3. Hook lấy tất cả giao dịch thanh toán cho Admin (VNPAY/momo...)
 * @param params
 */
export const useTransactionsPaymentAdmin = (params?: any) => {
    return useQuery({
        queryKey: ["transactions", "payment", "admin", params],
        queryFn: async () => {
            return await getAllTransactionsPaymentAdmin(params);
        },
        staleTime: 1000 * 60 * 5, // Cache 5 phút
    });
};

/**
 * 4. Hook cập nhật trạng thái giao dịch (Dành cho Admin)
 */
export const useUpdateTransactionStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            transactionId,
            status,
        }: {
            transactionId: number;
            status: string;
        }) => updateTransactionStatus(transactionId, status),
        onSuccess: () => {
            toast.success("Cập nhật trạng thái giao dịch thành công!");
            // Làm tươi danh sách giao dịch
            queryClient.invalidateQueries({
                queryKey: ["transactions", "admin"],
            });
        },
        onError: (error: any) => {
            const msg = error?.message || "Lỗi khi cập nhật trạng thái";
            toast.error(msg);
        },
    });
};

/**
 * 5. Hook Tạo giao dịch mới (Ví dụ: Yêu cầu rút tiền)
 */
export const useCreateTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: TransactionRequest) => createTransaction(data),
        onSuccess: () => {
            toast.success("Đã gửi yêu cầu giao dịch thành công!");
            queryClient.invalidateQueries({ queryKey: ["transactions", "me"] });
        },
        onError: (error: any) => {
            const msg = error?.message || "Lỗi khi xử lý giao dịch";
            toast.error(msg);
        },
    });
};
