package project.back_end.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.back_end.entity.Review;
import project.back_end.entity.User;
import project.back_end.entity.product.Product;
import project.back_end.enumerate.ErrorCode;
import project.back_end.exception.AppException;
import project.back_end.mapper.ReviewMapper;
import project.back_end.repository.ProductRepository;
import project.back_end.repository.ReviewRepository;
import project.back_end.repository.UserRepository;
import project.back_end.request.ReviewRequest;
import project.back_end.response.ProductRatingSummary;
import project.back_end.response.ReviewResponse;
import project.back_end.service.ReviewService;

import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ReviewMapper reviewMapper;

    @Override
    @Transactional
    public ReviewResponse createReview(ReviewRequest request, String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        Review review = Review.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .rating(request.getRating())
                .skuId(request.getSkuId())
                .purchasedVariantName(request.getPurchasedVariantName())
                .user(user)
                .product(product)
                .isVerified(true)
                .build();

        Review savedReview = reviewRepository.save(review);

        return reviewMapper.toResponse(savedReview);
    }

    @Override
    public Page<ReviewResponse> getReviewsByProduct(String productSlug, Pageable pageable) {
        return reviewRepository.findByProductSlug(productSlug, pageable)
                .map(reviewMapper::toResponse);
    }

    @Override
    public Page<ReviewResponse> getReviewsByUser(Long userId, Pageable pageable) {
        return reviewRepository.findByUserId(userId, pageable)
                .map(reviewMapper::toResponse);
    }

    @Override
    public Page<ReviewResponse> getAllReviews(Pageable pageable) {
        return reviewRepository.findAll(pageable)
                .map(reviewMapper::toResponse);
    }

    @Override
    @Transactional
    public void deleteReview(Long reviewId, String username) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (!review.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.REVIEW_PERMISSION_DENIED);
        }
        reviewRepository.delete(review);
    }

    @Override
    public Map<Integer, Long> getRatingStatistics(Long productId) {
        return reviewRepository.findByProductId(productId)
                .stream()
                .collect(Collectors.groupingBy(Review::getRating, Collectors.counting()));
    }

    @Override
    public Double getAverageRating(Long productId) {
        return reviewRepository.calculateAverageRating(productId);
    }


    @Override
    public ProductRatingSummary getReviewSummary(Long productId) {
        Map<Integer, Long> ratingCounts = getRatingStatistics(productId);

        Long totalReviews = ratingCounts.values().stream()
                .mapToLong(Long::longValue)
                .sum();

        Double averageRating = getAverageRating(productId);

        if (averageRating == null) averageRating = 0.0;

        return ProductRatingSummary.builder()
                .totalReviews(totalReviews)
                .averageRating(averageRating)
                .ratingCounts(ratingCounts)
                .build();
    }
}