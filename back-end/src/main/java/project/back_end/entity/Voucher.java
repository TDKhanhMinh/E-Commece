package project.back_end.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vouchers")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Voucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code; // Mã voucher (ví dụ: FREESHIP, GIAM20K)

    @Column(nullable = false)
    private String description; // Mô tả (ví dụ: Miễn phí vận chuyển)

    @Column(nullable = false)
    private Double discountValue; // Giá trị giảm (Ví dụ: 20000 hoặc 10 cho 10%)

    @Column(nullable = false)
    private String discountType; // Loại giảm giá: FIXED (số tiền cố định) hoặc PERCENTAGE (%)

    @Column(nullable = false)
    private Double minOrder; // Đơn tối thiểu để áp dụng (Ví dụ: 500000)

    private Double maxDiscount; // Số tiền giảm tối đa (thường dùng cho loại PERCENTAGE)

    private Integer usageLimit; // Giới hạn số lần sử dụng tổng cộng

    private Integer usedCount; // Số lần đã sử dụng thực tế

    @Column(nullable = false)
    private LocalDateTime startDate; // Ngày bắt đầu có hiệu lực

    @Column(nullable = false)
    private LocalDateTime endDate; // Ngày hết hạn

    private Boolean active; // Trạng thái kích hoạt (true/false)

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "voucher", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<UserVoucher> userVouchers = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.active = true;
        this.usedCount = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
