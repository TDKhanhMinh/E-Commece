package project.back_end.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import project.back_end.enumerate.NotificationType;
import project.back_end.response.NotificationResponse;


@Service
public interface NotificationService {
    String sendNotification(String targetToken, String title, String body);

    void sendAndSaveNotificationToUser(project.back_end.entity.User user, String title, String body, NotificationType type);

    void updateUserDeviceToken(String email, String deviceToken);

    Page<NotificationResponse> getNotificationsForUser(String email, Pageable pageable, String type);

    void markAllNotificationsAsRead(String email);

    void markNotificationAsRead(Long notificationId);
}
