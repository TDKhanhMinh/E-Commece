"use client";

import { Badge } from "@/components/ui/badge";
import { ProductPriceProps } from "@/type/product-type";

export function ProductPrice({
    salePrice,
    originalPrice,
    discountPercent,
    className = "",
}: ProductPriceProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    return (
        <div className={`flex flex-row flex-wrap items-center gap-2 sm:gap-3 ${className}`}>
            <span
                className="text-xl font-bold text-red-600 sm:text-2xl lg:text-3xl"
                itemProp="price"
                content={salePrice.toString()}
            >
                {formatPrice(salePrice)}
            </span>
            {discountPercent > 0 && (
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm line-through sm:text-base lg:text-lg">
                        {formatPrice(originalPrice)}
                    </span>
                    <Badge
                        variant="outline"
                        className="border-red-200 bg-red-50/50 text-[10px] whitespace-nowrap text-red-600 sm:text-xs"
                    >
                        Tiết kiệm {formatPrice(originalPrice - salePrice)}
                    </Badge>
                </div>
            )}
            <meta itemProp="priceCurrency" content="VND" />
        </div>
    );
}
