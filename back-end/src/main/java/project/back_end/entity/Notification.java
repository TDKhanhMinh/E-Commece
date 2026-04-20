package project.back_end.entity;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import project.back_end.enumerate.NotificationType;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipper_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private ShipperProfile shipperProfile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User user;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private String title;
    private String message;
    private Boolean isRead = false;

    // @Column(columnDefinition = "json")
    // private String metadata;
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}