package project.back_end.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import project.back_end.response.NotificationResponse;


@Service
public interface NotificationService {
    String sendNotification(String targetToken, String title, String body);

    void updateUserDeviceToken(String email, String deviceToken);

    Page<NotificationResponse> getNotificationsForUser(String email, Pageable pageable, String type);

    void markAllNotificationsAsRead(String email);

    void markNotificationAsRead(Long notificationId);
}
