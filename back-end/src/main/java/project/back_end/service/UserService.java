package project.back_end.service;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import project.back_end.dto.user.UserDTO;
import project.back_end.entity.User;
import project.back_end.request.AuthRequest.ChangePasswordRequest;
import project.back_end.request.AuthRequest.LoginRequest;
import project.back_end.request.AuthRequest.RegisterRequest;
import project.back_end.request.UserRequest.UpdateUserRequest;
import project.back_end.response.AuthResponse;
import project.back_end.response.UserResponse.UserResponse;

@Service
public interface UserService {
    UserDTO getUserProfile(String username);

    UserResponse registerUser(RegisterRequest user);

    AuthResponse loginUser(LoginRequest loginRequest);

    Page<UserResponse> getAllUsers(int page, int size, String sortBy, String sortDir, String search);

    String sendOtp(String email);

    boolean verifyOtp(String email, String otp);

    void resetPassword(String email, String newPassword);

    UserDTO updateUser(UpdateUserRequest updateUserRequest, String username);

    void changeUserPassword(String email, ChangePasswordRequest changePasswordRequest);

    User getCurrentUser();
    void createAdminUserIfNotExist();
}
