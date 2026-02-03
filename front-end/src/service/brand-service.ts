import http, { ApiResponse, PageResponse } from "@/service/http";
import { Brand, BrandRequest } from "@/type/brand-type";

export interface Attribute {
    id: number;
    name: string;
    code: string;
    type: "TEXT" | "SELECT" | "NUMBER";
}

export interface BrandSearchParams {
    page?: number;
    size?: number;
    keyword?: string;
}

export const getAttributes = async () =>
    http.get<ApiResponse<Attribute[]>>("/attributes");

export const getBrands = async (params?: BrandSearchParams) => {
    const queryParams = new URLSearchParams();

    if (params?.page !== undefined) {
        queryParams.append("page", params.page.toString());
    }
    if (params?.size !== undefined) {
        queryParams.append("size", params.size.toString());
    }
    if (params?.keyword) {
        queryParams.append("keyword", params.keyword);
    }

    const queryString = queryParams.toString();
    const url = queryString ? `/brands?${queryString}` : "/brands";

    return http.get<ApiResponse<PageResponse<Brand>>>(url);
};

export const createBrand = async (data: BrandRequest) =>
    http.post<ApiResponse<Brand>>("/brands", data);

export const updateBrand = async (id: number, data: BrandRequest) =>
    http.put<ApiResponse<Brand>>(`/brands/${id}`, data);

export const deleteBrand = async (id: number) =>
    http.delete<ApiResponse<void>>(`/brands/${id}`);
