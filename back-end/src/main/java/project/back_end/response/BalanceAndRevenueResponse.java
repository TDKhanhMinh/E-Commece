package project.back_end.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BalanceAndRevenueResponse {
    private BigDecimal balance;
    private BigDecimal revenueInCurrentMonth;
    private BigDecimal revenueInCurrentDay;
    private BigDecimal revenueInCurrentWeek;
}
