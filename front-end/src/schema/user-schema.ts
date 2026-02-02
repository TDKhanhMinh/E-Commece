import * as z from "zod";

export const updateUserSchema = z.object({
    name: z.string().min(1, "Vui lòng nhập tên đầy đủ"),
    phone: z
        .string()
        .min(10, "Số điện thoại phải có 10 ký tự")
        .max(10, "Số điện thoại phải có 10 ký tự"),
    // dob: z.string().min(1, "Vui lòng nhập ngày sinh"),
    // gender: z.string().min(1, "Vui lòng nhập giới tính"),
});
