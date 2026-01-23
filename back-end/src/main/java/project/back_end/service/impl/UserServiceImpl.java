package project.back_end.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import project.back_end.config.JwtUtils;
import project.back_end.dto.user.UserDTO;
import project.back_end.entity.User;
import project.back_end.exception.AppException;
import project.back_end.exception.ErrorCode;
import project.back_end.mapper.UserMapper;
import project.back_end.repository.UserRepository;
import project.back_end.request.AuthRequest.LoginRequest;
import project.back_end.request.AuthRequest.RegisterRequest;
import project.back_end.response.AuthResponse;
import project.back_end.response.UserResponse.UserResponse;
import project.back_end.service.UserService.UserService;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepo;
    private final UserMapper userMapper;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDTO getUserProfile(String username) {
        User user = userRepo.findByEmail(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserDTO(user);
    }

    @Override
    public UserResponse registerUser(RegisterRequest user) {
        User savedUser = new User();
        if (userRepo.existsByEmail(user.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }
        savedUser.setName(user.getName());
        savedUser.setPhone(user.getPhone());
        savedUser.setEmail(user.getEmail());
        savedUser.setRole(User.Role.USER);
        savedUser.setPassword(passwordEncoder.encode(user.getPassword()));
        savedUser.setCreatedAt(LocalDateTime.now());
        savedUser.setAvatarUrl("https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=");
        userRepo.save(savedUser);
        log.info("User registered successfully: {}", savedUser.getEmail());
        return userMapper.toUserResponse(savedUser);
    }

    @Override
    public AuthResponse loginUser(LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        User user = userRepo.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (!user.getIsActive()) {
            throw new AppException(ErrorCode.USER_INACTIVE);
        }
        

        UserDetails userDetails =
                (UserDetails) authentication.getPrincipal();

        assert userDetails != null;
        String token = jwtUtils.generateToken(userDetails);

        return new AuthResponse(token, userMapper.toUserDTO(user));
    }


    @Override
    public List<UserDTO> getAllUsers() {
        return userRepo.findAll().stream()
                .map(userMapper::toUserDTO)
                .toList();
    }

}
