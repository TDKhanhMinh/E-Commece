package project.back_end.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import project.back_end.request.AuthRequest.ChangePasswordRequest;
import project.back_end.request.AuthRequest.LoginRequest;
import project.back_end.request.AuthRequest.RegisterRequest;
import project.back_end.response.ApiResponse;
import project.back_end.response.AuthResponse;
import project.back_end.response.UserResponse.UserResponse;
import project.back_end.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest loginRequest) {
        AuthResponse authResponse = userService.loginUser(loginRequest);
        log.info("User logged in successfully: {}", loginRequest.getEmail());
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Login successful", authResponse)
        );
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@Validated @RequestBody RegisterRequest registerRequest) {
        log.info("Register request received for email with role: {}", registerRequest.getRole());
        UserResponse userResponse = userService.registerUser(registerRequest);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Registration successful", userResponse)
        );
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@RequestParam String email) {
        log.info("Forgot password request received for email: {}", email);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Password reset link sent to email", userService.sendOtp(email))
        );
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Boolean>> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        log.info("Verify OTP request received for email: {}", email);
        boolean isValid = userService.verifyOtp(email, otp);
        String message = isValid ? "OTP is valid" : "OTP is invalid";
        return ResponseEntity.ok(
                new ApiResponse<>(200, message, isValid)
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@RequestParam String email, @RequestParam String newPassword) {
        log.info("Reset password request received for email: {}", email);
        userService.resetPassword(email, newPassword);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Password reset successfully", null)
        );
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(@AuthenticationPrincipal UserDetails userDetails, @Validated @RequestBody ChangePasswordRequest changePasswordRequest) {
        String email = userDetails.getUsername();
        userService.changeUserPassword(email, changePasswordRequest);
        log.info("Password changed successfully for email: {}", email);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Password changed successfully", null)
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        userService.logoutUser(email);
        log.info("User logged out successfully: {}", email);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Logout successful", null)
        );
    }
}
