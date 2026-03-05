"use client";

import { ProductStructuredDataProps } from "@/type/product-type";

export function ProductStructuredData({
    product,
    sku,
    slug,
}: ProductStructuredDataProps) {
    if (!sku) return null;

    const structuredData = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: product.name,
        image: product.image,
        description:
            product.description || `${product.name} - Chất lượng cao, giá tốt`,
        sku: sku.skuCode,
        brand: {
            "@type": "Brand",
            name: product.brand || "Unknown",
        },
        offers: {
            "@type": "Offer",
            url: `${typeof window !== "undefined" ? window.location.origin : ""}/product/${slug}`,
            priceCurrency: "VND",
            price: sku.salePrice,
            availability:
                sku.stock > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
            priceValidUntil: new Date(
                new Date().setMonth(new Date().getMonth() + 1)
            )
                .toISOString()
                .split("T")[0],
            seller: {
                "@type": "Organization",
                name: "Your Store Name",
            },
        },
        ...(product.rating &&
            product.rating > 0 && {
                aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: product.rating,
                    reviewCount: product.reviewCount || 0,
                    bestRating: 5,
                    worstRating: 1,
                },
            }),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}
