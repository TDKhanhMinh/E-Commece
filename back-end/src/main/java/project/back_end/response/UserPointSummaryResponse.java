package project.back_end.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPointSummaryResponse {
    private Long currentPoints;          // Điểm có thể tiêu
    private Long totalAccumulatedPoints; // Điểm xét hạng
    private String membershipTier;       // Vàng, Bạc, Đồng
    private Long pointsToNextTier;       // Số điểm cần thêm để lên hạng tiếp theo
}