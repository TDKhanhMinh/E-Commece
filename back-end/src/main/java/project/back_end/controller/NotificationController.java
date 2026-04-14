package project.back_end.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import project.back_end.dto.user.TokenDto;
import project.back_end.response.ApiResponse;
import project.back_end.response.NotificationResponse;
import project.back_end.service.NotificationService;

@Slf4j
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @PostMapping("/subscribe")
    public ResponseEntity<ApiResponse<?>> subscribe(@RequestBody TokenDto request, @AuthenticationPrincipal UserDetails userDetails) {
        String token = request.getToken();
        String email = userDetails.getUsername();
        notificationService.updateUserDeviceToken(email, token);
        log.error("Save Device Token into DB: " + token);
        return ResponseEntity.ok(new ApiResponse<>(200, "Đăng ký nhận thông báo thành công", null));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<NotificationResponse>>> getNotifications(@AuthenticationPrincipal UserDetails userDetails,
                                                                                    Pageable pageable,
                                                                                    @RequestParam(required = false) String type) {
        String email = userDetails.getUsername();
        System.out.println("Fetching notifications for user: " + email + ", type: " + type);
        Page<NotificationResponse> notifications = notificationService.getNotificationsForUser(email, pageable, type);
        return ResponseEntity.ok(new ApiResponse<>(200, "Lấy thông báo thành công", notifications));
    }
}

