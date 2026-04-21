"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Filter, Loader2, Star } from "lucide-react";
import { useReviewsByProduct, useReviewSummary } from "@/hooks/use-review";
import { ReviewDialog } from "@/components/common/dialog/review-dialog";
import { ReviewCard } from "@/components/common/product/review-card";

interface ProductReviewsProps {
    productSlug: string;
    productId: number;
    productName: string;
    productImage?: string;
}

function ProductReviews({
    productSlug,
    productId,
    productName,
    productImage = "/placeholder-product.png",
}: ProductReviewsProps) {
    const [params, setParams] = useState({
        page: 0,
        size: 6,
        sortBy: "reviewDate",
        sortDirection: "DESC",
    });

    const { data, isLoading } = useReviewsByProduct(productSlug, params);
    // @ts-ignore
    const reviews = data?.content || [];

    const { data: summaryData, isLoading: isSummaryLoading } =
        useReviewSummary(productId);

    const handleSortChange = (value: string) => {
        switch (value) {
            case "newest":
                setParams((prev) => ({
                    ...prev,
                    sortBy: "reviewDate",
                    sortDirection: "DESC",
                }));
                break;
            case "oldest":
                setParams((prev) => ({
                    ...prev,
                    sortBy: "reviewDate",
                    sortDirection: "ASC",
                }));
                break;
            case "rating-highest":
                setParams((prev) => ({
                    ...prev,
                    sortBy: "rating",
                    sortDirection: "DESC",
                }));
                break;
            case "rating-lowest":
                setParams((prev) => ({
                    ...prev,
                    sortBy: "rating",
                    sortDirection: "ASC",
                }));
                break;
        }
    };

    if (isLoading || isSummaryLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="mt-12 mb-12 flex w-full flex-col items-center gap-6 py-5 sm:gap-8 sm:py-8">
            <section className="container px-4">
                <div className="mb-8 w-full text-center sm:mb-12">
                    <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl dark:text-slate-100">
                        Reviews
                    </h2>
                </div>

                <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
                    {/* Summary Section */}
                    <div className="flex w-full flex-col gap-6 sm:flex-row sm:items-center sm:justify-start lg:w-3/5 lg:gap-8">
                        <div className="flex flex-col items-center justify-center rounded-2xl bg-muted/30 p-6 sm:p-8">
                            <span className="text-4xl font-bold sm:text-5xl">
                                {
                                    // @ts-ignore
                                    summaryData?.averageRating?.toFixed(1) ||
                                        "0.0"
                                }
                            </span>
                            <div className="my-3 flex flex-row items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-5 w-5 sm:h-6 sm:w-6 ${
                                            i <
                                            Math.round(
                                                // @ts-ignore
                                                summaryData?.averageRating || 0
                                            )
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-muted-foreground text-sm font-medium">
                                {
                                    // @ts-ignore
                                    summaryData?.totalReviews || 0
                                }{" "}
                                reviews
                            </span>
                        </div>

                        <div className="flex-1 space-y-2">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count =
                                    // @ts-ignore
                                    summaryData?.ratingCounts?.[star] || 0;
                                // @ts-ignore
                                const percentage = summaryData?.totalReviews
                                    ? // @ts-ignore
                                      (count / summaryData.totalReviews) * 100
                                    : 0;

                                return (
                                    <div
                                        key={star}
                                        className="flex flex-row items-center gap-3"
                                    >
                                        <span className="w-3 text-sm font-medium">
                                            {star}
                                        </span>
                                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                        <Progress
                                            value={percentage}
                                            className="h-2 flex-1"
                                        />
                                        <span className="text-muted-foreground w-8 text-right text-xs">
                                            {count}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Filter Section */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:w-2/5 lg:flex-col lg:items-start lg:justify-start">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">
                                Filter reviews
                            </span>
                            <Filter className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex gap-3">
                            <Select
                                defaultValue="newest"
                                onValueChange={handleSortChange}
                            >
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Time & Rating</SelectLabel>
                                        <SelectItem value="newest">
                                            Newest first
                                        </SelectItem>
                                        <SelectItem value="oldest">
                                            Oldest first
                                        </SelectItem>
                                        <SelectItem value="rating-highest">
                                            Highest Rating
                                        </SelectItem>
                                        <SelectItem value="rating-lowest">
                                            Lowest Rating
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <div className="hidden lg:block">
                                <ReviewDialog
                                    productId={productId}
                                    productName={productName}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="block lg:hidden">
                        <ReviewDialog
                            productId={productId}
                            productName={productName}
                        />
                    </div>
                </div>

                <Separator className="my-8 sm:my-12" />

                {reviews.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {reviews.map((review: any) => (
                            <ReviewCard
                                key={review.id}
                                reviewerName={review.reviewerName}
                                reviewDate={new Date(
                                    review.reviewDate
                                ).toLocaleDateString()}
                                rating={review.rating}
                                title={review.title}
                                content={review.content}
                                reviewerImage={review.reviewerImage}
                                productName={review.productName || productName}
                                productImage={
                                    review.productImage || productImage
                                }
                                isVerified={review.isVerified}
                                className="h-full"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-muted-foreground py-16 text-center sm:py-24">
                        Sản phẩm chưa có đánh giá nào.
                    </div>
                )}

                {data &&
                    // @ts-ignore
                    !data.last && (
                        <div className="mt-10 text-center sm:mt-16">
                            <Button
                                onClick={() =>
                                    setParams((prev) => ({
                                        ...prev,
                                        size: prev.size + 6,
                                    }))
                                }
                                className="w-full rounded-full bg-green-900 py-6 font-bold text-white transition-colors hover:bg-green-800 sm:w-auto sm:px-12"
                            >
                                Load more reviews
                            </Button>
                        </div>
                    )}
            </section>
        </div>
    );
}

export default ProductReviews;
