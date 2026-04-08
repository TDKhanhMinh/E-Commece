package project.back_end.entity;

import jakarta.persistence.*;
import lombok.*;
import project.back_end.enumerate.PointTransactionType;

import java.time.LocalDateTime;

@Entity
@Table(name = "point_history")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class MemberShipPointHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Long pointDelta;
    private Long balanceAfter;

    @Enumerated(EnumType.STRING)
    private PointTransactionType type;

    private Long referenceId;
    private String description;
    private LocalDateTime createdAt = LocalDateTime.now();
}