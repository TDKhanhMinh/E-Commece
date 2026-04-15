import http from "@/service/http";
import { ApiResponse, PageResponse } from "@/type/api-type";
import {
    TransactionRequest,
    TransactionResponse,
} from "@/type/transaction-type";

/**
 * Lấy danh sách giao dịch của user hiện tại (Shipper)
 * @param params Object chứa: page, size, sortBy, sortDirection, status, type
 */
export const getMyTransactions = async (params?: any) =>
    http.get<ApiResponse<PageResponse<TransactionResponse>>>(
        `/wallet/transactions/me`,
        { params }
    );

/**
 * Lấy danh sách tất cả giao dịch (Dành cho Admin)
 * @param params Object chứa: page, size, sortBy...
 */
export const getAllTransactionsAdmin = async (params?: any) =>
    http.get<ApiResponse<PageResponse<TransactionResponse>>>(
        `/wallet/transactions/all`,
        { params }
    );

/**
 * Lấy chi tiết một giao dịch cụ thể
 * @param transactionId ID của giao dịch
 */
export const getTransactionById = async (transactionId: number) =>
    http.get<ApiResponse<TransactionResponse>>(
        `/wallet/transactions/${transactionId}`
    );

/**
 * Tạo một giao dịch mới (Ví dụ: Yêu cầu nạp tiền / rút tiền)
 * @param data Dữ liệu yêu cầu giao dịch
 */
export const createTransaction = async (data: TransactionRequest) =>
    http.post<ApiResponse<TransactionResponse>>("/wallet/transactions", data);
