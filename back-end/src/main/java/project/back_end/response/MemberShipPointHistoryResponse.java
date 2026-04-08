package project.back_end.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import project.back_end.enumerate.PointTransactionType;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberShipPointHistoryResponse {
    private Long id;
    private Long pointDelta;
    private Long balanceAfter;
    private PointTransactionType type;
    private Long referenceId;
    private String description;
    private LocalDateTime createdAt;

    // Bạn có thể thêm các getter logic để hiển thị đẹp hơn ở FE
    public String getStatusLabel() {
        return pointDelta > 0 ? "+" + pointDelta : String.valueOf(pointDelta);
    }
}
