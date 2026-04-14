package project.back_end.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import project.back_end.request.ReviewRequest;
import project.back_end.response.ProductRatingSummary;
import project.back_end.response.ReviewResponse;

import java.util.Map;

@Service
public interface ReviewService {

    /**
     * Tạo đánh giá mới từ người dùng
     */
    ReviewResponse createReview(ReviewRequest request, String username);

    /**
     * Lấy danh sách đánh giá của một sản phẩm (Phân trang)
     * Thường dùng ở trang chi tiết sản phẩm
     */
    Page<ReviewResponse> getReviewsByProduct(String productSlug, Pageable pageable);

    /**
     * Lấy danh sách đánh giá của một người dùng cụ thể
     * Thường dùng ở trang Profile -> Lịch sử đánh giá
     */
    Page<ReviewResponse> getReviewsByUser(Long userId, Pageable pageable);

    /**
     * Lấy tất cả đánh giá (Dành cho Admin quản lý)
     */
    Page<ReviewResponse> getAllReviews(Pageable pageable);

    /**
     * Xóa đánh giá (Admin hoặc chính chủ sở hữu)
     */
    void deleteReview(Long reviewId, String username);

    /**
     * Tính toán thống kê rating cho sản phẩm (Số lượng 5*, 4*, 3*...)
     * Trả về Map<Số sao, Số lượng>
     */
    Map<Integer, Long> getRatingStatistics(Long productId);

    /**
     * Tính điểm trung bình rating của sản phẩm
     */
    Double getAverageRating(Long productId);

    ProductRatingSummary getReviewSummary(Long productId);
}