package project.back_end.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import project.back_end.enumerate.DeliveryStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "deliveries")
@Getter
@Setter
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "order_id", referencedColumnName = "id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "shipper_id")
    private ShipperProfile shipper;

    private String pickupAddress;
    private String pickupLatitude;
    private String pickupLongitude;
    
    @Column(columnDefinition = "TEXT")
    private String encodedPolyline;

    private String distanceText;
    private long distanceValue;

    private String durationText;

    private BigDecimal shippingCost;

    private BigDecimal amountToCollect;

    @Enumerated(EnumType.STRING)
    private DeliveryStatus status;

    private LocalDateTime createdAt = LocalDateTime.now();
}
