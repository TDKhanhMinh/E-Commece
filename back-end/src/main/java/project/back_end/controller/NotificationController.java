package project.back_end.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import project.back_end.dto.user.TokenDto;
import project.back_end.response.ApiResponse;
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
}

