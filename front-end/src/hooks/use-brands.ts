"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createBrand,
    deleteBrand,
    getBrands,
    updateBrand,
} from "@/service/brand-service";
import { toast } from "sonner";
import { BrandRequest } from "@/type/brand-type";

export const useBrands = () => {
    return useQuery({
        queryKey: ["brands"],
        queryFn: async () => {
            return await getBrands();
        },
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
};

export const useCreateBrand = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createBrand,
        onSuccess: () => {
            toast.success("Tạo thương hiệu thành công!");
            queryClient.invalidateQueries({ queryKey: ["brands"] });
        },
        onError: (err: any) => toast.error(err?.message || "Lỗi khi tạo"),
    });
};

// 3. Update
export const useUpdateBrand = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: BrandRequest }) =>
            updateBrand(id, data),
        onSuccess: () => {
            toast.success("Cập nhật thành công!");
            queryClient.invalidateQueries({ queryKey: ["brands"] });
        },
        onError: (err: any) => toast.error(err?.message || "Lỗi khi cập nhật"),
    });
};

// 4. Delete
export const useDeleteBrand = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteBrand,
        onSuccess: () => {
            toast.success("Đã xóa thương hiệu!");
            queryClient.invalidateQueries({ queryKey: ["brands"] });
        },
        onError: (err: any) => toast.error(err?.message || "Không thể xóa"),
    });
};
