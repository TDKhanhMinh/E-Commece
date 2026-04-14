package project.back_end.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShipperProfile {
    @Id
    private Long userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany
    @JoinColumn(name = "shipper_id")
    @ToString.Exclude
    private List<Delivery> deliveries;


    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipper_id")
    @ToString.Exclude
    private List<WalletTransaction> walletTransactions;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipper_id")
    @ToString.Exclude
    private List<Notification> notifications;


    @Column(name = "vehicle_type")
    private String vehicleType;

    @Column(name = "license_plate")
    private String licensePlate;

    @Column(name = "citizen_identification_card")
    private String citizenIdentificationCard;

    @Column(name = "is_online")
    private Boolean isOnline = false;

    @Column(name = "current_lat")
    private Double currentLat;

    @Column(name = "current_lng")
    private Double currentLng;

    @Column(name = "balance", precision = 15, scale = 2)
    private BigDecimal balance = BigDecimal.ZERO;

    @Column(name = "rating_average")
    private Double ratingAverage = 0.0;
}