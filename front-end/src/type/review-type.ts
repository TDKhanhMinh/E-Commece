export interface ReviewRequest {
    title: string;
    content: string;
    rating: number;
    productId: number;
    skuId?: number;
    purchasedVariantName?: string;
}
export interface ProductRatingSummary {
    totalReviews: number;
    averageRating: number;
    ratingCounts: Record<number, number>;
}

export interface ReviewResponse {
    id: number;
    title: string;
    content: string;
    rating: number;
    isVerified: boolean;
    reviewDate: string;
    reviewerName: string;
    reviewerImage: string;
    productName: string;
    productSlug: string;
    purchasedVariantName?: string;
}
