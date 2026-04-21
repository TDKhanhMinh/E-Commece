"use client";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { HeartIcon, Package, ShoppingCart, Star, Tag } from "lucide-react";
import Image from "next/image";
import { Badge } from "../../ui/badge";
import { formatCurrency } from "@/lib/format-price";

export interface ProductItemProps {
    id: number;
    name: string;
    slug: string;
    image: string;

    // Giá
    minPrice: number;
    maxPrice: number;
    discountPercent: number;

    // Trạng thái
    inStock: boolean;
    variantCount: number;

    // Thông tin phụ
    brandName: string;
    categoryName: string;

    // Social proof
    rating: number;
    reviewCount: number;
}

function ProductItem({ item }: { item: ProductItemProps }) {
    const {
        id,
        name,
        slug,
        image,
        minPrice,
        maxPrice,
        discountPercent,
        inStock,
        variantCount,
        brandName,
        categoryName,
        rating,
        reviewCount,
    } = item;

    const navigate = useRouter();
    const t = useTranslations("productItem");

    
    // Tính giá sau khi giảm
    const calculateSalePrice = (price: number, discount: number) => {
        return price * (1 - discount / 100);
    };

    const salePrice = calculateSalePrice(minPrice, discountPercent);
    const maxSalePrice = calculateSalePrice(maxPrice, discountPercent);

    // Generate structured data for SEO
    const structuredData = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: name,
        image: image,
        description: `${brandName} ${name} - ${categoryName}`,
        brand: {
            "@type": "Brand",
            name: brandName,
        },
        offers: {
            "@type": "Offer",
            url: `${typeof window !== "undefined" ? window.location.origin : ""}/product/${slug}`,
            priceCurrency: "VND",
            price: salePrice,
            availability: inStock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            priceValidUntil: new Date(
                new Date().setMonth(new Date().getMonth() + 1)
            )
                .toISOString()
                .split("T")[0],
        },
        ...(rating > 0 && {
            aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: rating,
                reviewCount: reviewCount,
            },
        }),
    };

    return (
        <>
            {/* SEO structured data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData),
                }}
            />

            <Card
                onClick={() => navigate.push(`/product/${slug}`)}
                className="group relative flex h-full max-w-sm cursor-pointer flex-col overflow-hidden rounded-xl border-0 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:border dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/50"
                itemScope
                itemType="https://schema.org/Product"
            >
                {/* Badges Container */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    {discountPercent > 0 && (
                        <Badge className="rounded-lg bg-linear-to-r from-red-500 to-pink-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                            <Tag className="mr-1 h-3 w-3" />
                            {t("sale")} {discountPercent}%
                        </Badge>
                    )}
                    {!inStock && (
                        <Badge className="rounded-lg bg-gray-800 px-3 py-1.5 text-xs font-bold text-white">
                            {t("outOfStock")}
                        </Badge>
                    )}
                </div>

                {/* Favorite Button */}
                <Button
                    className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm transition-all hover:scale-110 hover:bg-white dark:bg-slate-800/90 dark:text-slate-100 dark:hover:bg-slate-700"
                    variant="ghost"
                    size="icon"
                    aria-label={t("addToFavorite")}
                    onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement favorite functionality
                    }}
                >
                    <HeartIcon className="h-4 w-4 text-red-500 transition-colors hover:fill-red-500" />
                </Button>

                {/* Product Image */}
                <div className="relative aspect-square w-full overflow-hidden bg-linear-to-br from-gray-50 to-gray-100 p-6 dark:from-slate-800 dark:to-slate-900">
                    <Image
                        src={image || "/placeholder-product.png"}
                        alt={`${brandName} ${name} - ${categoryName}`}
                        title={`${brandName} ${name}`}
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        itemProp="image"
                    />

                    {/* Out of stock overlay */}
                    {!inStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                            <span className="text-lg font-bold text-white">
                                {t("temporarilyOutOfStock")}
                            </span>
                        </div>
                    )}

                    {/* Quick action button on hover */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 transition-all duration-300 group-hover:opacity-100">
                        <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90 rounded-full text-white shadow-lg"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate.push(`/product/${slug}`);
                            }}
                        >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            {t("viewDetails")}
                        </Button>
                    </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-1 flex-col gap-3 p-4">
                    {/* Category & Brand */}
                    <div className="flex items-center justify-between gap-2">
                        <span
                            className="text-primary text-xs font-medium"
                            itemProp="brand"
                            itemScope
                            itemType="https://schema.org/Brand"
                        >
                            <span itemProp="name">{brandName}</span>
                        </span>
                        <span className="text-muted-foreground text-xs">
                            {categoryName}
                        </span>
                    </div>

                    {/* Product Name */}
                    <h3
                        className="group-hover:text-primary line-clamp-2 text-start text-base leading-tight font-semibold text-gray-900 transition-colors dark:text-slate-100 dark:group-hover:text-blue-400"
                        itemProp="name"
                        title={name}
                    >
                        {name}
                    </h3>

                    {/* Rating */}
                    {rating > 0 ? (
                        <div
                            className="flex items-center gap-2"
                            itemProp="aggregateRating"
                            itemScope
                            itemType="https://schema.org/AggregateRating"
                        >
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span
                                    className="text-sm font-semibold dark:text-slate-100"
                                    itemProp="ratingValue"
                                >
                                    {rating.toFixed(1)}
                                </span>
                            </div>
                            {reviewCount > 0 && (
                                <span className="text-muted-foreground text-xs">
                                    (
                                    <span itemProp="reviewCount">
                                        {reviewCount}
                                    </span>{" "}
                                    {t("reviews", { count: reviewCount })})
                                </span>
                            )}
                        </div>
                    ) : (
                        <div className="text-muted-foreground flex items-center gap-1 text-xs">
                            <Star className="h-3 w-3" />
                            <span>{t("noReviews")}</span>
                        </div>
                    )}

                    {/* Variant Info */}
                    {variantCount > 1 && (
                        <div className="text-muted-foreground flex items-center gap-1 text-xs">
                            <Package className="h-3 w-3" />
                            <span>{t("variantCount", { count: variantCount })}</span>
                        </div>
                    )}

                    {/* Price Section */}
                    <div
                        className="mt-auto border-t pt-3 dark:border-slate-800"
                        itemProp="offers"
                        itemScope
                        itemType="https://schema.org/Offer"
                    >
                        <meta itemProp="priceCurrency" content="VND" />
                        <meta itemProp="price" content={salePrice.toString()} />
                        <meta
                            itemProp="availability"
                            content={
                                inStock
                                    ? "https://schema.org/InStock"
                                    : "https://schema.org/OutOfStock"
                            }
                        />

                        <div className="flex items-end justify-between gap-2">
                            <div className="flex flex-col">
                                {/* Sale Price */}
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xl font-bold text-red-600 dark:text-red-400">
                                        {minPrice === maxPrice
                                            ? formatCurrency(salePrice)
                                            : `${formatCurrency(salePrice)}`}
                                    </span>
                                    {maxPrice > minPrice && (
                                        <span className="text-sm text-gray-500 dark:text-slate-400">
                                            - {formatCurrency(maxSalePrice)}
                                        </span>
                                    )}
                                </div>

                                {/* Original Price */}
                                {discountPercent > 0 && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-400 line-through dark:text-slate-500">
                                            {formatCurrency(minPrice)}
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className="border-red-200 px-2 py-0 text-xs text-red-600 dark:border-red-900/30 dark:text-red-400"
                                        >
                                            {t("savings", {
                                                amount: formatCurrency(
                                                    minPrice - salePrice
                                                ),
                                            })}
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stock Status */}
                        <div className="mt-2 flex items-center gap-1.5">
                            {inStock ? (
                                <>
                                    <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                                    <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                        {t("inStock")}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                    <span className="text-xs font-medium text-red-600 dark:text-red-400">
                                        {t("outOfStockStatus")}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Hover effect overlay */}
                <div className="group-hover:border-primary/20 pointer-events-none absolute inset-0 rounded-xl border-2 border-transparent transition-colors"></div>
            </Card>
        </>
    );
}

export default ProductItem;
