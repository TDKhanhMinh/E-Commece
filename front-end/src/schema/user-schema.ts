import * as z from "zod";

export const updateUserSchema = z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
});
export const addDeliveryAddressSchema = z.object({
    location: z.string().min(1, "Vui lòng nhập địa chỉ"),
    userName: z.string().min(1, "Vui lòng nhập tên người nhận"),
    phoneNumber: z.string().min(1, "Vui lòng nhập số điện thoại"),
    isDefault: z.boolean().optional(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
});
