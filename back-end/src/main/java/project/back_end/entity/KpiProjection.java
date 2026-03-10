package project.back_end.entity;

import java.math.BigDecimal;

public interface KpiProjection {
    BigDecimal getTotalRevenue();

    Long getOrderCount();
}