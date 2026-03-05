"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    createCategory,
    deleteCategory,
    getAllCategories,
    updateCategory,
} from "@/service/categories-service";
import { CategoryRequest, CategorySearchParams } from "@/type/category-type";

// 1. Hook lấy danh sách với phân trang
export const useCategories = (params?: CategorySearchParams) => {
    return useQuery({
        queryKey: ["categories", params],
        queryFn: async () => {
            return await getAllCategories(params);
        },
        staleTime: 1000 * 60 * 5,
    });
};

// 1.1 Hook lấy tất cả categories (không phân trang) cho dropdown/tree
export const useAllCategories = () => {
    return useQuery({
        queryKey: ["categories", "all"],
        queryFn: async () => {
            // Lấy với size lớn để có tất cả categories
            return await getAllCategories({ size: 1000 });
        },
        staleTime: 1000 * 60 * 5,
    });
};

// 2. Hook Tạo mới
export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CategoryRequest) => createCategory(data),
        onSuccess: (response) => {
            toast.success("Tạo danh mục thành công!");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: (error: any) => {
            const msg = error?.message || "Lỗi khi tạo danh mục";
            toast.error(msg);
        },
    });
};

// 3. Hook Cập nhật
export const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: CategoryRequest }) =>
            updateCategory(id, data),
        onSuccess: () => {
            toast.success("Cập nhật thành công!");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: (error: any) => {
            const msg = error?.message || "Lỗi khi cập nhật";
            toast.error(msg);
        },
    });
};

// 4. Hook Xóa
export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteCategory(id),
        onSuccess: () => {
            toast.success("Đã xóa danh mục!");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: (error: any) => {
            const msg = error?.message || "Không thể xóa danh mục này";
            toast.error(msg);
        },
    });
};
