package project.back_end.response;

import lombok.*;

@AllArgsConstructor
@Data
@Getter
@Setter
@NoArgsConstructor
public class PaymentTransactionResponse {
    private Long id;
    private Long orderId;
    private String userEmail;
    private String transactionCode;
    private String orderReference;
    private String amount;
    private String paymentMethod;
    private String bankCode;
    private String status;
    private String vnpResponseCode;
    private String paymentDate;
    private String createdAt;
}
