package project.back_end.entity;

import jakarta.persistence.*;
import lombok.Data;
import project.back_end.enumerate.TransactionAction;
import project.back_end.enumerate.TransactionStatus;
import project.back_end.enumerate.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
public class WalletTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipper_id")
    private ShipperProfile shipperProfile;

    private Long referenceId;

    @Enumerated(EnumType.STRING)
    private TransactionType type;
    @Enumerated(EnumType.STRING)
    private TransactionAction action;
    @Enumerated(EnumType.STRING)
    private TransactionStatus status;

    private BigDecimal amount;
    private BigDecimal balanceAfter;
    private String description;
    private final LocalDateTime createdAt = LocalDateTime.now();
}
