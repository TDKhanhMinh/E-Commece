import * as z from "zod";

export const reviewSchema = (t: any) =>
    z.object({
        title: z.string().min(5, t("validation.titleMin")),
        content: z.string().min(10, t("validation.contentMin")),
        rating: z.number().min(1, t("validation.ratingMin")).max(5),
    });
