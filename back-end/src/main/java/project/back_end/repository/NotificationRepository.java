package project.back_end.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import project.back_end.entity.Notification;
import project.back_end.entity.ShipperProfile;
import project.back_end.entity.User;
import project.back_end.enumerate.NotificationType;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Page<Notification> getNotificationByShipperProfile(ShipperProfile shipperProfile, Pageable pageable);

    Page<Notification> getNotificationByShipperProfileAndType(ShipperProfile shipperProfile, NotificationType type, Pageable pageable);

    Page<Notification> getNotificationByShipperProfileAndIsRead(ShipperProfile shipperProfile, Boolean isRead, Pageable pageable);

    Page<Notification> getNotificationByUser(User user, Pageable pageable);

    Page<Notification> getNotificationByUserAndType(User user, NotificationType type, Pageable pageable);

    Page<Notification> getNotificationByUserAndIsRead(User user, Boolean isRead, Pageable pageable);

}
