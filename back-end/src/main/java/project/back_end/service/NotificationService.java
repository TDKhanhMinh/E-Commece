package project.back_end.service;

import org.springframework.stereotype.Service;

@Service
public interface NotificationService {
    String sendNotification(String targetToken, String title, String body);

    void updateUserDeviceToken(String email, String deviceToken);
}
