package project.back_end.service.impl;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import org.springframework.stereotype.Service;
import project.back_end.service.NotificationService;

@Service
public class NotificationServiceImpl implements NotificationService {
    @Override
    public String sendNotification(String targetToken, String title, String body) {
        try {
            Notification notification = Notification.builder()
                    .setTitle(title)
                    .setBody(body)
                    .build();

            Message message = Message.builder()
                    .setNotification(notification)
                    .setToken(targetToken)
                    .build();

            return FirebaseMessaging.getInstance().send(message);
        } catch (Exception e) {
            System.err.println("Lỗi gửi FCM: " + e.getMessage());
            return null;
        }
    }
}
