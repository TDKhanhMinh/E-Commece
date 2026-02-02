import { z } from "zod";

export const registerSchema = z
    .object({
        phone: z
            .string()
            .min(10, "Số điện thoại phải có 10 ký tự")
            .max(10, "Số điện thoại phải có 10 ký tự"),
        email: z
            .string()
            .min(1, "Vui lòng nhập email")
            .email("Email không hợp lệ"),
        name: z.string().min(1, "Vui lòng nhập tên đầy đủ"),
        password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
        confirmPassword: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu nhập lại không khớp",
        path: ["confirmPassword"],
    });
export const loginSchema = z.object({
    email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});
export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
        newPassword: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
        confirmPassword: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Mật khẩu nhập lại không khớp",
    });
export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Vui lòng nhập email" })
        .email({ message: "Email không hợp lệ" }),
});
export const otpSchema = z.object({
    otp: z.string().min(6, {
        message: "Mã OTP phải bao gồm 6 chữ số.",
    }),
});

export const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
            .regex(/[A-Z]/, { message: "Phải chứa ít nhất 1 chữ hoa" })
            .regex(/[0-9]/, { message: "Phải chứa ít nhất 1 số" }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu xác nhận không khớp",
        path: ["confirmPassword"], // Hiển thị lỗi ở ô confirmPassword
    });
