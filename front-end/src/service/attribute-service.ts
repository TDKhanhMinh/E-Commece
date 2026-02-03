import { Attribute, AttributeRequest } from "@/type/attribute-type";
import http, { ApiResponse, PageResponse } from "@/service/http";

export interface AttributeSearchParams {
    page?: number;
    size?: number;
    keyword?: string;
    code?: string;
}

export const getAttributes = async (params?: AttributeSearchParams) => {
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
    if (params?.code) {
        queryParams.append("code", params.code);
    }

    const queryString = queryParams.toString();
    const url = queryString ? `/attributes?${queryString}` : "/attributes";

    return http.get<ApiResponse<PageResponse<Attribute>>>(url);
};

export const createAttribute = async (data: AttributeRequest) =>
    http.post<ApiResponse<Attribute>>("/attributes", data);

export const updateAttribute = async (id: number, data: AttributeRequest) =>
    http.put<ApiResponse<Attribute>>(`/attributes/${id}`, data);

export const deleteAttribute = async (id: number) =>
    http.delete<ApiResponse<void>>(`/attributes/${id}`);
