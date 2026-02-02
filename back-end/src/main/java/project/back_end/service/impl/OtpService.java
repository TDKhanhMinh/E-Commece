package project.back_end.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import project.back_end.exception.AppException;
import project.back_end.exception.ErrorCode;

import java.security.SecureRandom;
import java.time.Duration;

@Service
@RequiredArgsConstructor
public class OtpService {
    private final StringRedisTemplate redisTemplate;

    private static final long OTP_EXPIRATION_MINUTES = 2;
    private static final int OTP_LENGTH = 6;

    private static final String KEY_PREFIX = "OTP_RESET_PASSWORD:";

    /**
     * Hàm 1: Sinh OTP, Lưu vào Redis và Trả về mã
     */
    public String generateAndSaveOtp(String email) {
        String otp = generateRandomOtp();

        String redisKey = KEY_PREFIX + email;

        redisTemplate.opsForValue().set(redisKey, otp, Duration.ofMinutes(OTP_EXPIRATION_MINUTES));

        return otp;
    }

    /**
     * Hàm 2: Xác thực OTP
     */
    public boolean validateOtp(String email, String inputOtp) {
        String redisKey = KEY_PREFIX + email;

        String storedOtp = redisTemplate.opsForValue().get(redisKey);

        if (storedOtp == null) {
            throw new AppException(ErrorCode.OTP_EXPIRED);
        }

        if (!storedOtp.equals(inputOtp)) {
            throw new AppException(ErrorCode.INVALID_OTP);
        }

        redisTemplate.delete(redisKey);
        return true;
    }


    private String generateRandomOtp() {
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            sb.append(random.nextInt(10)); // 0-9
        }
        return sb.toString();
    }
}