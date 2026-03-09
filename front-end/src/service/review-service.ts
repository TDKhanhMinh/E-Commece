import http from "@/service/http";
import { ApiResponse, PageResponse } from "@/type/api-type";
import {
    ProductRatingSummary,
    ReviewRequest,
    ReviewResponse,
} from "@/type/review-type";

/**
 * Lấy danh sách đánh giá của một sản phẩm dựa trên Slug
 * @param slug Đường dẫn thân thiện của sản phẩm
 * @param params Object chứa: page, size, sortBy, sortDirection
 */
export const getReviewsByProduct = async (slug: string, params?: any) =>
    http.get<ApiResponse<PageResponse<ReviewResponse>>>(
        `/reviews/product/${slug}`,
        { params }
    );
/**
 * Lấy tóm tắt thống kê đánh giá (tổng số, trung bình sao, chi tiết từng sao)
 * @param productId ID của sản phẩm
 */
export const getReviewSummary = async (productId: number) =>
    http.get<ApiResponse<ProductRatingSummary>>(
        `/reviews/product/${productId}/summary`
    );
/**
 * Tạo một đánh giá mới
 */
export const createReview = async (data: ReviewRequest) =>
    http.post<ApiResponse<ReviewResponse>>("/reviews", data);

/**
 * Lấy tất cả đánh giá (Dành cho Admin quản lý)
 * @param params Object chứa: page, size, sortBy, sortDirection
 */
export const getAllReviewsAdmin = async (params?: any) =>
    http.get<ApiResponse<PageResponse<ReviewResponse>>>("/reviews/admin/all", {
        params,
    });

/**
 * Xóa một đánh giá
 * @param id ID của bài đánh giá
 */
export const deleteReview = async (id: number) =>
    http.delete<ApiResponse<void>>(`/reviews/${id}`);
