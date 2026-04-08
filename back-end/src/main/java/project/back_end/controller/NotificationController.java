package project.back_end.controller;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.back_end.response.ApiResponse;
import project.back_end.service.NotificationService;

@Slf4j


@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @PostMapping("/subscribe")
    public ResponseEntity<ApiResponse<?>> subscribe(@RequestBody TokenDto request) {
        String token = request.getToken();
        // TODO: Lưu token này vào database, gắn với User ID hiện tại
        System.out.println("Lưu Device Token vào DB: " + token);
        return ResponseEntity.ok(new ApiResponse<>(200, "Đăng ký nhận thông báo thành công", null));
    }

    @PostMapping("/send-notification")
    public ResponseEntity<?> sendTest(@RequestBody PushNotificationRequest request) {
        String response = notificationService.sendNotification(
                request.getToken(),
                "Thông báo từ hệ thống",
                "Có đơn hàng mới đã được tạo. Vui lòng kiểm tra!"
        );

        if (response != null) {
            return ResponseEntity.ok("Đã gửi thành công. Message ID: " + response);
        }
        return ResponseEntity.badRequest().body("Gửi thông báo thất bại");
    }
}

@Setter
@Getter
class TokenDto {
    private String token;

}

@Setter
@Getter
class PushNotificationRequest {
    private String token;

}