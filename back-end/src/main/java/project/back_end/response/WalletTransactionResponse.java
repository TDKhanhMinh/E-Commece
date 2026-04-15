package project.back_end.response;

import lombok.*;

@AllArgsConstructor
@Data
@Getter
@Setter
@NoArgsConstructor
public class WalletTransactionResponse {
    private Long transactionId;
    private String type;
    private String transactionAction;
    private String transactionStatus;
    private String amount;
    private String description;
    private String createdAt;
}
