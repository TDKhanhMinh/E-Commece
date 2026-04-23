package project.back_end.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import project.back_end.enumerate.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_transaction")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "transaction_code")
    private String transactionCode;

    @Column(name = "order_reference")
    private String orderReference;

    private BigDecimal amount;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "bank_code")
    private String bankCode;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    @Column(name = "vnp_response_code")
    private String vnpResponseCode;

    @Column(name = "payment_date")
    private String paymentDate;

    @Column(name = "created_at")
    private final LocalDateTime createdAt = LocalDateTime.now();
}
