package project.back_end.service.UserService;

import org.springframework.stereotype.Service;
import project.back_end.dto.user.UserDTO;
import project.back_end.entity.User;
import project.back_end.request.AuthRequest.LoginRequest;
import project.back_end.request.AuthRequest.RegisterRequest;
import project.back_end.response.AuthResponse;
import project.back_end.response.UserResponse.UserResponse;

import java.util.List;

@Service
public interface UserService {
    UserDTO getUserProfile(String username);

    UserResponse registerUser(RegisterRequest user);

    AuthResponse loginUser(LoginRequest loginRequest);

    List<UserDTO> getAllUsers();


}
