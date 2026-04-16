package project.back_end.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WithdrawResponse {
    private Long transactionId;
    private BigDecimal amount;
    private BigDecimal balanceAfter;
    private String status;
    private String description;
    private String createdAt;
}
