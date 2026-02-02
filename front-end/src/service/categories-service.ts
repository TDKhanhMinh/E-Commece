export interface Category {
    id: number;
    name: string;
    slug: string;
    level: number;
    children?: Category[];
}

export interface CategoryRequest {
    name: string;
    parentId?: number | null;
}

import { AxiosResponse } from "axios";
import http, { ApiResponse } from "@/service/http";

// 1. Lấy tất cả danh mục
export const getAllCategories: () => Promise<
    AxiosResponse<ApiResponse<Category[]>>
> = async (): Promise<AxiosResponse<ApiResponse<Category[]>>> => {
    return http.get<ApiResponse<Category[]>>("/categories");
};

// 2. Lấy chi tiết 1 danh mục
export const getCategoryById: (
    id: number
) => Promise<AxiosResponse<ApiResponse<Category>>> = async (
    id: number
): Promise<AxiosResponse<ApiResponse<Category>>> => {
    return http.get<ApiResponse<Category>>(`/categories/${id}`);
};

// 3. Tạo mới danh mục
export const createCategory: (
    data: CategoryRequest
) => Promise<AxiosResponse<ApiResponse<Category>>> = async (
    data: CategoryRequest
): Promise<AxiosResponse<ApiResponse<Category>>> => {
    return http.post<ApiResponse<Category>>("/categories", data);
};

// 4. Cập nhật danh mục
export const updateCategory: (
    id: number,
    data: CategoryRequest
) => Promise<AxiosResponse<ApiResponse<Category>>> = async (
    id: number,
    data: CategoryRequest
): Promise<AxiosResponse<ApiResponse<Category>>> => {
    return http.put<ApiResponse<Category>>(`/categories/${id}`, data);
};

// 5. Xóa danh mục
export const deleteCategory: (
    id: number
) => Promise<AxiosResponse<ApiResponse<void>>> = async (
    id: number
): Promise<AxiosResponse<ApiResponse<void>>> => {
    return http.delete<ApiResponse<void>>(`/categories/${id}`);
};
