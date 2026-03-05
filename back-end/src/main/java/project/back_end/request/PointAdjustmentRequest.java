package project.back_end.request;


import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import project.back_end.entity.PointTransactionType;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PointAdjustmentRequest {
    @NotNull(message = "USER_ID_REQUIRED")
    private Long userId;

    @NotNull(message = "POINT_AMOUNT_REQUIRED")
    private Long amount;

    private PointTransactionType type = PointTransactionType.ADMIN_ADJUST;

    private String description;
}