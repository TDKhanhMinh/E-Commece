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
public class VoucherResponse {
    private Long id;
    private String code;
    private String description;
    private Double discountValue;
    private String discountType;
    private Double minOrder;
    private Double maxDiscount;
    private Integer usageLimit;
    private Integer usedCount; // Admin cần biết mã này đã dùng bao nhiêu lần
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean active;
}