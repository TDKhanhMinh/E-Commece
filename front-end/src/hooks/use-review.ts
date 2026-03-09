"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    createReview,
    deleteReview,
    getAllReviewsAdmin,
    getReviewsByProduct,
    getReviewSummary,
} from "@/service/review-service";
import { ReviewRequest } from "@/type/review-type";

/**
 * 1. Hook lấy danh sách đánh giá theo sản phẩm (Dùng cho Client)
 * @param slug
 * @param params
 */
export const useReviewsByProduct = (slug: string, params?: any) => {
    return useQuery({
        queryKey: ["reviews", "product", slug, params],
        queryFn: async () => {
            return await getReviewsByProduct(slug, params);
        },
        staleTime: 1000 * 60,
        enabled: !!slug,
    });
};

/**
 * 2. Hook lấy tất cả đánh giá cho Admin quản lý
 * @param params
 */
export const useReviewsAdmin = (params?: any) => {
    return useQuery({
        queryKey: ["reviews", "admin", params],
        queryFn: async () => {
            return await getAllReviewsAdmin(params);
        },
        staleTime: 1000 * 60 * 5,
    });
};

/**
 * 3. Hook Tạo đánh giá mới
 */
export const useCreateReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ReviewRequest) => createReview(data),
        onSuccess: () => {
            toast.success("Cảm ơn bạn đã đánh giá sản phẩm!");
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
        onError: (error: any) => {
            const msg = error?.message || "Lỗi khi gửi đánh giá";
            toast.error(msg);
        },
    });
};

/**
 * 4. Hook Xóa đánh giá (Dùng cho Admin hoặc chính chủ)
 */
export const useDeleteReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteReview(id),
        onSuccess: () => {
            toast.success("Đã xóa đánh giá thành công!");
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
        onError: (error: any) => {
            const msg = error?.message || "Không thể xóa đánh giá này";
            toast.error(msg);
        },
    });
};
export const useReviewSummary = (productId: number) => {
    return useQuery({
        queryKey: ["reviews", "summary", productId],
        queryFn: async () => await getReviewSummary(productId),
        enabled: !!productId,
    });
};
