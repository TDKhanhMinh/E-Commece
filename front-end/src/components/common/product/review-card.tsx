"use client";

import Image from "next/image";
import { ShieldCheckIcon, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fDateTime } from "@/lib/format-date-time";

export interface ReviewCardProps {
    reviewerName: string;
    reviewDate: string;
    rating?: number;
    title: string;
    content: string;
    reviewerImage: string;
    productName: string;
    productImage: string;
    isVerified?: boolean;
    onMoreReviewsClick?: () => void;
    className?: string;
}

export function ReviewCard({
    reviewerName,
    reviewDate,
    rating = 5,
    title,
    content,
    reviewerImage,
    productName,
    productImage,
    isVerified = true,
    onMoreReviewsClick,
    className = "",
}: ReviewCardProps) {
    // @ts-ignore
    return (
        <Card
            className={`group relative flex max-w-sm shrink-0 cursor-pointer flex-col items-center gap-2 p-6 shadow-xl transition-transform hover:-translate-y-1 ${className}`}
        >
            <div className="flex w-full items-center justify-between gap-2">
                <div className="flex w-full flex-col items-start gap-1 text-start">
                    <div className="flex w-full flex-row items-center gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                                key={index}
                                className={
                                    index < rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                }
                            />
                        ))}
                    </div>
                    <span>{reviewerName}</span>
                    <div className="flex flex-row items-start justify-center">
                        {isVerified && (
                            <ShieldCheckIcon className="text-success h-4 w-4" />
                        )}
                        <div className="text-secondary-dark border-r border-black/20 px-2 text-sm">
                            {isVerified ? "Verified Purchase" : "Purchase"}
                        </div>
                        <div className="text-secondary-dark ml-2 text-sm">
                            {fDateTime(reviewDate, "dd/MM/yyyy")}
                        </div>
                    </div>
                </div>

                <div className="relative h-18 w-18 shrink-0">
                    <Image
                        src={
                            // @ts-ignore
                            "https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png" ||
                            reviewerImage
                        }
                        fill
                        alt={`Review by ${reviewerName}`}
                        className="rounded-full object-cover shadow-lg"
                    />
                </div>
            </div>

            <div className="text-md w-full truncate py-2 text-start font-bold">
                {title}
            </div>

            <div className="text-secondary-foreground flex min-h-36 w-full justify-between gap-2 text-start text-sm">
                {content}
            </div>

            <div className="w-full">
                <div className="mt-4 flex w-full flex-row items-center">
                    <div className="relative h-16 w-12 shrink-0">
                        <Image
                            src={
                                // @ts-ignore
                                "https://tse3.mm.bing.net/th/id/OIP.ZGCYlE0vicQWM6EWpLLOHgHaEK?rs=1&pid=ImgDetMain&o=7&rm=3" ||
                                productImage
                            }
                            fill
                            alt={productName}
                            className="w-full rounded-md object-cover shadow-lg"
                        />
                    </div>
                    <div className="w-full text-sm">
                        <span className="text-secondary-foreground ml-4 line-clamp-2 text-start text-sm">
                            {productName}
                        </span>

                        <div className="flex w-full justify-start pl-4">
                            <Button
                                variant="ghost"
                                className="px-0 text-yellow-800 hover:bg-transparent hover:text-yellow-500 hover:underline"
                                onClick={onMoreReviewsClick}
                            >
                                More Reviews
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
