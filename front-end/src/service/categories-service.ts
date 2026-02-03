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

export interface CategorySearchParams {
    page?: number;
    size?: number;
    keyword?: string;
}

import http, { ApiResponse, PageResponse } from "@/service/http";

// 1. Lấy tất cả danh mục với phân trang
export const getAllCategories = async (params?: CategorySearchParams) => {
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
    const url = queryString ? `/categories?${queryString}` : "/categories";

    return http.get<ApiResponse<PageResponse<Category>>>(url);
};

// 2. Lấy chi tiết 1 danh mục
export const getCategoryById = async (id: number) => {
    return http.get<ApiResponse<Category>>(`/categories/${id}`);
};

// 3. Tạo mới danh mục
export const createCategory = async (data: CategoryRequest) => {
    return http.post<ApiResponse<Category>>("/categories", data);
};

// 4. Cập nhật danh mục
export const updateCategory = async (id: number, data: CategoryRequest) => {
    return http.put<ApiResponse<Category>>(`/categories/${id}`, data);
};

// 5. Xóa danh mục
export const deleteCategory = async (id: number) => {
    return http.delete<ApiResponse<void>>(`/categories/${id}`);
};
