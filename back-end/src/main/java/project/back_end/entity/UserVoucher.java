package project.back_end.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@Table(name = "user_vouchers")
@NoArgsConstructor
@AllArgsConstructor
public class UserVoucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voucher_id")
    private Voucher voucher;

    @Column(name = "is_used")
    private Boolean isUsed = false; // Trạng thái đã dùng hay chưa

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt; // Thời điểm user thu thập voucher

    @Column(name = "used_at")
    private LocalDateTime usedAt; // Thời điểm thực tế áp dụng vào đơn hàng
}
