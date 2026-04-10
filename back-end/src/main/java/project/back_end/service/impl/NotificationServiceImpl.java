package project.back_end.service.impl;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import project.back_end.entity.User;
import project.back_end.enumerate.ErrorCode;
import project.back_end.exception.AppException;
import project.back_end.repository.UserRepository;
import project.back_end.service.NotificationService;

@Service
@AllArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final UserRepository userRepository;

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
            String errorMsg = e.getMessage();
            if (errorMsg != null && errorMsg.contains("PERMISSION_DENIED")) {
                System.err.println("❌ FCM PERMISSION ERROR: Service account lacks 'cloudmessaging.messages.create' permission.");
                System.err.println("   Fix: Add 'Firebase Cloud Messaging Admin' role to the service account in Google Cloud Console.");
                System.err.println("   Project: native-app-shipping");
                System.err.println("   Service Account: firebase-adminsdk-fbsvc@native-app-shipping.iam.gserviceaccount.com");
            } else if (errorMsg != null && errorMsg.contains("invalid-argument")) {
                System.err.println("❌ FCM ERROR: Invalid device token or message format.");
            } else {
                System.err.println("❌ FCM ERROR: " + errorMsg);
            }
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public void updateUserDeviceToken(String email, String deviceToken) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        user.setDeviceToken(deviceToken);
        userRepository.save(user);
    }
}
