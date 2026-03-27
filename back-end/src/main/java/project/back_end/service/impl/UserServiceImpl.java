package project.back_end.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.back_end.config.JwtUtils;
import project.back_end.dto.user.UserDTO;
import project.back_end.entity.CustomUserDetails;
import project.back_end.entity.User;
import project.back_end.exception.AppException;
import project.back_end.exception.ErrorCode;
import project.back_end.mapper.UserMapper;
import project.back_end.repository.UserRepository;
import project.back_end.request.AuthRequest.ChangePasswordRequest;
import project.back_end.request.AuthRequest.LoginRequest;
import project.back_end.request.AuthRequest.RegisterRequest;
import project.back_end.request.UserRequest.UpdateUserRequest;
import project.back_end.response.AuthResponse;
import project.back_end.response.UserResponse.UserResponse;
import project.back_end.service.UserService;

import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepo;
    private final UserMapper userMapper;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final EmailService emailService;
    private final UserRepository userRepository;

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
    public void createAdminUserIfNotExist() {
    User savedUser = new User();
    if (userRepo.existsByEmail("admin@gmail.com")) {
        throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
    }
    savedUser.setName("Admin");
    savedUser.setPhone("0123456789");
    savedUser.setEmail("admin@gmail.com");
    savedUser.setRole(User.Role.ADMIN);
    savedUser.setPassword(passwordEncoder.encode("123456789"));
    savedUser.setCreatedAt(LocalDateTime.now());
    savedUser.setAvatarUrl("https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=");
    userRepo.save(savedUser);
    log.info("User registered successfully: {}", savedUser.getEmail());
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

        return new AuthResponse(token, userMapper.toUserDTO(user), user.getRole().name());
    }


    @Override
    public Page<UserResponse> getAllUsers(int page, int size, String sortBy, String sortDir, String search) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<User> usersPage = userRepo.searchUsers(search, pageable);

        return usersPage.map(userMapper::toUserResponse);
    }

    @Override
    public String sendOtp(String email) {
        boolean exited = userRepo.existsByEmail(email);
        if (exited) {
            log.info("OTP sent to email: {}", email);
            String otpCode = otpService.generateAndSaveOtp(email);
            emailService.sendOtpEmail(email, otpCode);
            return otpCode;
        } else {
            log.warn("Email not found for OTP: {}", email);
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
    }

    @Override
    public boolean verifyOtp(String email, String otp) {
        return otpService.validateOtp(email, otp);
    }

    @Override
    public void resetPassword(String email, String newPassword) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);
        log.info("Password reset successfully for email: {}", email);
    }

    @Override
    @Transactional
    public UserDTO updateUser(UpdateUserRequest request, String username) {
        User user = userRepo.findByEmail(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }

        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            if (!request.getPhone().equals(user.getPhone())) {
                user.setPhone(request.getPhone());
            }
        }

        User updatedUser = userRepo.save(user);

        log.info("User updated successfully: {}", user.getEmail());
        return userMapper.toUserDTO(updatedUser);
    }

    @Override
    public void changeUserPassword(String email, ChangePasswordRequest changePasswordRequest) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (!passwordEncoder.matches(changePasswordRequest.getCurrentPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.PASSWORD_MISMATCH);
        }
        if (changePasswordRequest.getCurrentPassword().equals(changePasswordRequest.getNewPassword())) {
            throw new AppException(ErrorCode.SAME_PASSWORD);
        }
        user.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
        userRepo.save(user);
        log.info("User password changed successfully: {}", user.getEmail());
    }


    @Override
    public User getCurrentUser() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof CustomUserDetails userDetails) {
            return userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        }

        throw new AppException(ErrorCode.UNAUTHORIZED);
    }

}
