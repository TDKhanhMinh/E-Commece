package project.back_end.service.impl;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import project.back_end.entity.ShipperProfile;
import project.back_end.entity.User;
import project.back_end.enumerate.ErrorCode;
import project.back_end.enumerate.NotificationType;
import project.back_end.exception.AppException;
import project.back_end.mapper.NotificationMapper;
import project.back_end.repository.NotificationRepository;
import project.back_end.repository.UserRepository;
import project.back_end.response.NotificationResponse;
import project.back_end.service.NotificationService;


@Service
@AllArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

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

    @Override
    public Page<NotificationResponse> getNotificationsForUser(String email, Pageable pageable, String type) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        ShipperProfile shipperProfile = user.getShipperProfile();
        if (shipperProfile == null) {
            throw new AppException(ErrorCode.SHIPPER_PROFILE_NOT_FOUND);
        }
        if (!type.equals("ALL")) {
            NotificationType notificationType = parseNotificationType(type);

            return notificationRepository.getNotificationByShipperProfileAndType(shipperProfile, notificationType, pageable)
                    .map(notificationMapper::toNotificationResponse);
        }
        return notificationRepository.getNotificationByShipperProfile(shipperProfile, pageable)
                .map(notificationMapper::toNotificationResponse);

    }

    @Override
    public void markAllNotificationsAsRead(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        ShipperProfile shipperProfile = user.getShipperProfile();
        if (shipperProfile == null) {
            throw new AppException(ErrorCode.SHIPPER_PROFILE_NOT_FOUND);
        }
        Page<NotificationResponse> notifications = notificationRepository.getNotificationByShipperProfile(shipperProfile, Pageable.unpaged())
                .map(notificationMapper::toNotificationResponse);

        notifications.forEach(notification -> {
            notification.setIsRead(true);
            notificationRepository.save(notificationMapper.toNotificationEntity(notification));
        });
    }

    @Override
    public void markNotificationAsRead(Long notificationId) {

    }

    private NotificationType parseNotificationType(String type) {
        try {
            return NotificationType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }
    }
}
