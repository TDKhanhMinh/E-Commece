package project.back_end.request.VoucherRequest;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoucherRequest {

    @NotBlank(message = "Mã voucher không được để trống")
    private String code;

    @NotBlank(message = "Mô tả không được để trống")
    private String description;

    @NotNull(message = "Giá trị giảm giá không được để trống")
    @Min(value = 0, message = "Giá trị giảm giá phải lớn hơn hoặc bằng 0")
    private Double discountValue;

    @NotBlank(message = "Loại giảm giá (FIXED/PERCENTAGE) không được để trống")
    private String discountType;

    @NotNull(message = "Điều kiện đơn tối thiểu không được để trống")
    @Min(value = 0, message = "Điều kiện đơn tối thiểu phải lớn hơn hoặc bằng 0")
    private Double minOrder;

    private Double maxDiscount; // Có thể null nếu là FIXED

    @Min(value = 1, message = "Giới hạn sử dụng phải ít nhất là 1")
    private Integer usageLimit; // Số lượng voucher tối đa được phát hành

    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDateTime startDate;

    @NotNull(message = "Ngày kết thúc không được để trống")
    private LocalDateTime endDate;

    private Boolean active; // Trạng thái kích hoạt (mặc định nên là true)
}