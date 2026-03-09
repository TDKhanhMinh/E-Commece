import * as z from "zod";

export const reviewSchema = z.object({
    title: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự"),
    content: z.string().min(10, "Nội dung đánh giá phải có ít nhất 10 ký tự"),
    rating: z.number().min(1, "Vui lòng chọn số sao").max(5),
});
