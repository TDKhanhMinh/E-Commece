package project.back_end.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import project.back_end.request.AuthRequest.LoginRequest;
import project.back_end.request.AuthRequest.RegisterRequest;
import project.back_end.response.ApiResponse;
import project.back_end.response.AuthResponse;
import project.back_end.response.UserResponse.UserResponse;
import project.back_end.service.UserService.UserService;

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
        log.info("Register request received for email: {}", registerRequest.getEmail());
        UserResponse userResponse = userService.registerUser(registerRequest);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Registration successful", userResponse)
        );
    }
}
