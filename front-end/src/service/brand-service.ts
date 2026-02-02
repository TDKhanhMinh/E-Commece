import http, { ApiResponse } from "@/service/http";
import { Brand, BrandRequest } from "@/type/brand-type";

export interface Attribute {
    id: number;
    name: string; // Tên hiển thị (Màu sắc)
    code: string; // Mã code (color)
    type: "TEXT" | "SELECT" | "NUMBER";
}

export const getAttributes = async () =>
    http.get<ApiResponse<Attribute[]>>("/attributes");
export const getBrands = async () => http.get<ApiResponse<Brand[]>>("/brands");

export const createBrand = async (data: BrandRequest) =>
    http.post<ApiResponse<Brand>>("/brands", data);

export const updateBrand = async (id: number, data: BrandRequest) =>
    http.put<ApiResponse<Brand>>(`/brands/${id}`, data);

export const deleteBrand = async (id: number) =>
    http.delete<ApiResponse<void>>(`/brands/${id}`);
