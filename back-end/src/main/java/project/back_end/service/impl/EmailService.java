package project.back_end.service.impl;


import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import project.back_end.exception.AppException;
import project.back_end.exception.ErrorCode;

import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender javaMailSender;

    @Async
    public void sendOtpEmail(String toEmail, String otpCode) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());

            helper.setTo(toEmail);
            helper.setSubject("Mã xác thực OTP của bạn");

            String OTP_TEMPLATE = """
                    <!DOCTYPE html>
                    <html lang="vi">
                    <head>
                        <meta charset="UTF-8">
                        <title>Mã OTP xác thực</title>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                            body {
                                margin: 0;
                                padding: 0;
                                background-color: #f3f4f6;
                                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
                                             Roboto, "Helvetica Neue", Arial, sans-serif;
                            }
                    
                            .container {
                                max-width: 600px;
                                margin: 24px auto;
                                background-color: #ffffff;
                                border-radius: 12px;
                                overflow: hidden;
                                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
                            }
                    
                            .header {
                                background: linear-gradient(135deg, #4f46e5, #6366f1);
                                padding: 28px 20px;
                                text-align: center;
                                color: #ffffff;
                            }
                    
                            .header h1 {
                                margin: 0;
                                font-size: 26px;
                                font-weight: 700;
                                letter-spacing: 0.5px;
                            }
                    
                            .content {
                                padding: 32px 28px;
                                text-align: center;
                                color: #111827;
                            }
                    
                            .content h2 {
                                margin-top: 0;
                                font-size: 22px;
                                font-weight: 600;
                            }
                    
                            .content p {
                                font-size: 15px;
                                line-height: 1.6;
                                color: #374151;
                            }
                    
                            .otp-wrapper {
                                margin: 28px 0;
                            }
                    
                            .otp-code {
                                display: inline-block;
                                padding: 16px 28px;
                                font-size: 34px;
                                font-weight: 700;
                                letter-spacing: 6px;
                                color: #4f46e5;
                                background-color: #eef2ff;
                                border-radius: 10px;
                                font-family: "Courier New", monospace;
                                border: 1px solid #c7d2fe;
                            }
                    
                            .expire {
                                margin-top: 12px;
                                font-size: 14px;
                                color: #6b7280;
                            }
                    
                            .warning {
                                margin-top: 24px;
                                padding: 14px;
                                background-color: #fff7ed;
                                color: #b45309;
                                border-radius: 8px;
                                font-size: 14px;
                            }
                    
                            .footer {
                                padding: 18px;
                                background-color: #f9fafb;
                                text-align: center;
                                font-size: 12px;
                                color: #6b7280;
                                border-top: 1px solid #e5e7eb;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>T7M Shop</h1>
                            </div>
                    
                            <div class="content">
                                <h2>Xác thực tài khoản</h2>
                                <p>
                                    Bạn vừa yêu cầu <strong>đặt lại mật khẩu</strong>.
                                    Vui lòng sử dụng mã OTP bên dưới để tiếp tục:
                                </p>
                    
                                <div class="otp-wrapper">
                                    <div class="otp-code">%s</div>
                                </div>
                    
                                <div class="expire">
                                    Mã có hiệu lực trong <strong>5 phút</strong>
                                </div>
                    
                                <div class="warning">
                                    Không chia sẻ mã này cho bất kỳ ai,
                                    kể cả nhân viên T7M Shop.
                                </div>
                            </div>
                    
                            <div class="footer">
                                © 2026 T7M Shop. All rights reserved.<br>
                                Email này được gửi tự động, vui lòng không trả lời.
                            </div>
                        </div>
                    </body>
                    </html>
                    """;

            String htmlContent = String.format(OTP_TEMPLATE, otpCode);

            helper.setText(htmlContent, true);

            javaMailSender.send(message);
            log.info("Đã gửi OTP đến email: {}", toEmail);

        } catch (MessagingException e) {
            log.error("Lỗi khi gửi email: {}", e.getMessage());
            throw new AppException(ErrorCode.EMAIL_NOT_SENT);
        }
    }
}
