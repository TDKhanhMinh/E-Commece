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
        <div className="mt-12 mb-12 flex w-full flex-col items-center gap-8 py-5">
            <section className="container px-4">
                <div className="mb-8 w-full text-center">
                    <h1 className="text-4xl font-bold">Reviews</h1>
                </div>

                <div className="flex w-full flex-row gap-4">
                    <div className="w-2/4">
                        <div className="flex flex-row items-center justify-center">
                            <div className="flex flex-col items-center justify-center px-4">
                                <span className="text-4xl font-semibold">
                                    {summaryData?.averageRating?.toFixed(2) ||
                                        "0.00"}
                                </span>
                                <div className="my-2 flex flex-row items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-7 w-7 ${
                                                i <
                                                Math.round(
                                                    summaryData?.averageRating ||
                                                        0
                                                )
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span>
                                    {summaryData?.totalReviews || 0} reviews
                                </span>
                            </div>
                            <div className="w-2/4">
                                {[5, 4, 3, 2, 1].map((star) => {
                                    const count =
                                        summaryData?.ratingCounts?.[star] || 0;
                                    const percentage = summaryData?.totalReviews
                                        ? (count / summaryData.totalReviews) *
                                          100
                                        : 0;

                                    return (
                                        <div
                                            key={star}
                                            className="flex flex-row items-center justify-center"
                                        >
                                            <span className="mx-4 w-4 text-lg">
                                                {star}
                                            </span>
                                            <Progress
                                                value={percentage}
                                                className="h-2"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="w-2/4">
                        <div className="flex flex-row items-center justify-start gap-4">
                            <span>
                                Filter reviews{" "}
                                <Filter className="mr-2 inline-block h-5 w-5" />
                            </span>
                            <Select
                                defaultValue="newest"
                                onValueChange={handleSortChange}
                            >
                                <SelectTrigger className="w-50">
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
                        </div>
                    </div>
                    <ReviewDialog
                        productId={productId}
                        productName={productName}
                    />
                </div>

                <Separator className="my-8" />

                {reviews.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                                className="max-w-full"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-muted-foreground py-20 text-center">
                        Sản phẩm chưa có đánh giá nào.
                    </div>
                )}

                {data && !data.last && (
                    <div className="container mx-auto mt-12 px-4 text-center">
                        <Button
                            onClick={() =>
                                setParams((prev) => ({
                                    ...prev,
                                    size: prev.size + 6,
                                }))
                            }
                            className="rounded-full bg-green-900 px-16 py-4 font-bold text-white hover:bg-green-800"
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
