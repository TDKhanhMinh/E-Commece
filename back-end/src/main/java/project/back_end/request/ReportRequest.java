package project.back_end.request;


import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ReportRequest {

    @NotNull(message = "Vui lòng chọn ngày bắt đầu")
    private LocalDate startDate;

    @NotNull(message = "Vui lòng chọn ngày kết thúc")
    private LocalDate endDate;

    private Integer topProductsLimit = 5;
}