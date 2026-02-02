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
