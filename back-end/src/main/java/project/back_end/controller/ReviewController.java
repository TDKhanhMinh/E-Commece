package project.back_end.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import project.back_end.request.ReviewRequest;
import project.back_end.response.ApiResponse;
import project.back_end.response.ProductRatingSummary;
import project.back_end.response.ReviewResponse;
import project.back_end.service.ReviewService;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/product/{slug}")
    public ResponseEntity<ApiResponse<Page<ReviewResponse>>> getReviewsByProduct(
            @PathVariable String slug,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "reviewDate") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {

        Sort.Direction direction = sortDirection.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        return ResponseEntity.ok(new ApiResponse<>(200, "Success",
                reviewService.getReviewsByProduct(slug, pageable)));
    }

    // Tạo đánh giá mới (Yêu cầu đăng nhập)
    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(new ApiResponse<>(200, "Review created successfully",
                reviewService.createReview(request, userDetails.getUsername())));
    }

    // Lấy tất cả đánh giá (Chỉ dành cho Admin quản lý)
    @GetMapping("/admin/all")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Page<ReviewResponse>>> getAllReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {

        Sort.Direction direction = sortDirection.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        return ResponseEntity.ok(new ApiResponse<>(200, "Success",
                reviewService.getAllReviews(pageable)));
    }

    // Xóa đánh giá (Admin hoặc Người dùng xóa bài của chính mình)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteReview(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        reviewService.deleteReview(id, username);

        return ResponseEntity.ok(new ApiResponse<>(200, "Review deleted successfully", null));
    }

    // Lấy tóm tắt thống kê đánh giá (tổng số, trung bình sao, chi tiết từng sao)
    @GetMapping("/product/{productId}/summary")
    public ResponseEntity<ApiResponse<ProductRatingSummary>> getProductRatingSummary(@PathVariable Long productId) {
        return ResponseEntity.ok(new ApiResponse<>(200, "Success",
                reviewService.getReviewSummary(productId)));
    }
}