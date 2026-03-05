import { AxiosResponse } from "axios";
import http from "@/service/http";
import {
    CollectVoucherRequest,
    UserVoucherResponse,
} from "@/type/voucher-type";

// ================= API CHO NGƯỜI DÙNG =================

export const getMyVouchers: () => Promise<
    AxiosResponse<UserVoucherResponse[]>
> = async (): Promise<AxiosResponse<UserVoucherResponse[]>> => {
    return http.get<UserVoucherResponse[]>("/user-vouchers/me");
};

export const collectVoucher: (
    data: CollectVoucherRequest
) => Promise<AxiosResponse<void>> = async (
    data: CollectVoucherRequest
): Promise<AxiosResponse<void>> => {
    return http.post<void>("/user-vouchers/collect", data);
};

// ================= API CHO ADMIN =================

export const getAllUserVouchers: () => Promise<
    AxiosResponse<UserVoucherResponse[]>
> = async (): Promise<AxiosResponse<UserVoucherResponse[]>> => {
    return http.get<UserVoucherResponse[]>("/user-vouchers");
};

export const assignVoucherToUser: (
    userId: number,
    voucherId: number
) => Promise<AxiosResponse<UserVoucherResponse>> = async (
    userId: number,
    voucherId: number
): Promise<AxiosResponse<UserVoucherResponse>> => {
    return http.post<UserVoucherResponse>("/user-vouchers/assign", null, {
        params: { userId, voucherId },
    });
};

export const removeVoucherFromUser: (
    id: number
) => Promise<AxiosResponse<void>> = async (
    id: number
): Promise<AxiosResponse<void>> => {
    return http.delete<void>(`/user-vouchers/${id}`);
};
