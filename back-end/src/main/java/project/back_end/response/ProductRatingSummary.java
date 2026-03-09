package project.back_end.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductRatingSummary {
    private Long totalReviews;          // Tổng số lượng đánh giá
    private Double averageRating;       // Điểm trung bình sao
    private Map<Integer, Long> ratingCounts; // Chi tiết số lượng theo từng sao (1-5)
}