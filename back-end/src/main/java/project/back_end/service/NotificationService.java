package project.back_end.service;

public interface NotificationService {
    String sendNotification(String targetToken, String title, String body);

    void updateUserDeviceToken(String email, String deviceToken);
}
