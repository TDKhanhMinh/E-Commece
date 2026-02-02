import * as z from "zod";

export const categorySchema = z.object({
    name: z.string().min(1, "Tên danh mục không được để trống"),
    parentId: z.string().optional(),
});
