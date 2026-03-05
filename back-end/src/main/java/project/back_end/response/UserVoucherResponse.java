package project.back_end.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserVoucherResponse {
    private Long id;
    private Long userId;

    private VoucherResponse voucher;

    private Boolean isUsed;
    private LocalDateTime assignedAt;
    private LocalDateTime usedAt;
}