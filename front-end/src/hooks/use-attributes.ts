"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createAttribute,
    deleteAttribute,
    getAttributes,
    updateAttribute,
} from "@/service/attribute-service";
import { AttributeRequest } from "@/type/attribute-type";
import { toast } from "sonner";

// 1. Get List
export const useAttributes = () => {
    return useQuery({
        queryKey: ["attributes"],
        queryFn: async () => {
            return await getAttributes();
        },
        staleTime: 1000 * 60 * 5,
    });
};

// 2. Create
export const useCreateAttribute = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createAttribute,
        onSuccess: () => {
            toast.success("Tạo thuộc tính thành công!");
            queryClient.invalidateQueries({ queryKey: ["attributes"] });
        },
        onError: (err: any) => toast.error(err?.message || "Lỗi khi tạo"),
    });
};

// 3. Update
export const useUpdateAttribute = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: AttributeRequest }) =>
            updateAttribute(id, data),
        onSuccess: () => {
            toast.success("Cập nhật thành công!");
            queryClient.invalidateQueries({ queryKey: ["attributes"] });
        },
        onError: (err: any) => toast.error(err?.message || "Lỗi khi cập nhật"),
    });
};

// 4. Delete
export const useDeleteAttribute = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteAttribute,
        onSuccess: () => {
            toast.success("Đã xóa thuộc tính!");
            queryClient.invalidateQueries({ queryKey: ["attributes"] });
        },
        onError: (err: any) => toast.error(err?.message || "Không thể xóa"),
    });
};
