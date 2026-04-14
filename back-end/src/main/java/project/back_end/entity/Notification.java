package project.back_end.entity;

import jakarta.persistence.*;
import lombok.Data;
import project.back_end.enumerate.NotificationType;

import java.time.LocalDateTime;

@Entity
@Data
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipper_id")
    private ShipperProfile shipperProfile;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private String title;
    private String message;
    private Boolean isRead = false;

    //    @Column(columnDefinition = "json")
//    private String metadata;
    private final LocalDateTime createdAt = LocalDateTime.now();
}