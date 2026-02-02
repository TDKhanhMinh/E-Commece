"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    CategoryRequest,
    createCategory,
    deleteCategory,
    getAllCategories,
    updateCategory,
} from "@/service/categories-service";

// 1. Hook lấy danh sách
export const useCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await getAllCategories();
            console.log("Fetched categories:", response);
            return response;
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
