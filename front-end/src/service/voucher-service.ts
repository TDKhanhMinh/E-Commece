import { AxiosResponse } from "axios";
import http from "@/service/http";
import { VoucherRequest, VoucherResponse } from "@/type/voucher-type";

// ================= API CHO NGƯỜI DÙNG =================

export const validateVoucher: (
    code: string,
    orderAmount: number
) => Promise<AxiosResponse<VoucherResponse>> = async (
    code,
    orderAmount
): Promise<AxiosResponse<VoucherResponse>> => {
    return http.get<VoucherResponse>("/vouchers/validate", {
        params: { code, orderAmount },
    });
};

// ================= API CHO ADMIN =================

export const getAllVouchers: () => Promise<
    AxiosResponse<VoucherResponse[]>
> = async (): Promise<AxiosResponse<VoucherResponse[]>> => {
    return http.get<VoucherResponse[]>("/vouchers");
};

export const getVoucherById: (
    id: number
) => Promise<AxiosResponse<VoucherResponse>> = async (
    id: number
): Promise<AxiosResponse<VoucherResponse>> => {
    return http.get<VoucherResponse>(`/vouchers/${id}`);
};

export const createVoucher: (
    data: VoucherRequest
) => Promise<AxiosResponse<VoucherResponse>> = async (
    data: VoucherRequest
): Promise<AxiosResponse<VoucherResponse>> => {
    return http.post<VoucherResponse>("/vouchers", data);
};

export const updateVoucher: (
    id: number,
    data: VoucherRequest
) => Promise<AxiosResponse<VoucherResponse>> = async (
    id: number,
    data: VoucherRequest
): Promise<AxiosResponse<VoucherResponse>> => {
    return http.put<VoucherResponse>(`/vouchers/${id}`, data);
};

export const disableVoucher: (
    id: number,
    action: boolean
) => Promise<AxiosResponse<void>> = async (
    id: number,
    action: boolean
): Promise<AxiosResponse<void>> => {
    return http.delete<void>(`/vouchers/${id}`, { params: { action } });
};
