"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, MessageSquarePlus, Star } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateReview } from "@/hooks/use-review";
import { reviewSchema } from "@/schema/review-schema";

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface AddReviewDialogProps {
    productId: number;
    productName: string;
}

export function ReviewDialog({ productId, productName }: AddReviewDialogProps) {
    const [open, setOpen] = useState(false);
    const { mutate: createReview, isPending } = useCreateReview();

    const form = useForm<ReviewFormValues>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            title: "",
            content: "",
            rating: 5,
        },
    });

    const onSubmit = (values: ReviewFormValues) => {
        createReview(
            {
                ...values,
                productId,
            },
            {
                onSuccess: () => {
                    setOpen(false);
                    form.reset();
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 rounded-full bg-green-900 font-bold hover:bg-green-800">
                    <MessageSquarePlus className="h-4 w-4" />
                    Viết đánh giá của bạn
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-125">
                <DialogHeader>
                    <DialogTitle>Đánh giá sản phẩm</DialogTitle>
                    <DialogDescription>
                        Chia sẻ cảm nhận của bạn về{" "}
                        <strong>{productName}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Interactive Star Rating */}
                        <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-center justify-center space-y-3">
                                    <FormLabel>Mức độ hài lòng</FormLabel>
                                    <FormControl>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() =>
                                                        field.onChange(star)
                                                    }
                                                    className="transition-transform hover:scale-110"
                                                >
                                                    <Star
                                                        className={`h-9 w-9 ${
                                                            star <= field.value
                                                                ? "fill-yellow-400 text-yellow-400"
                                                                : "text-gray-300"
                                                        }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tiêu đề</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ví dụ: Rất hài lòng, Máy đẹp như mới..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nội dung chi tiết</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Bạn thấy sản phẩm này thế nào? (Pin, hiệu năng, ngoại hình...)"
                                            className="min-h-30"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setOpen(false)}
                            >
                                Hủy bỏ
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="min-w-30 bg-green-900"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang gửi...
                                    </>
                                ) : (
                                    "Gửi đánh giá"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
