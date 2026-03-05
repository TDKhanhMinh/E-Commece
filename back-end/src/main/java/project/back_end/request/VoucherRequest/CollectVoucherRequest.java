package project.back_end.request.VoucherRequest;


import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CollectVoucherRequest {
    @NotBlank(message = "Mã voucher không được để trống")
    private String code;
}
