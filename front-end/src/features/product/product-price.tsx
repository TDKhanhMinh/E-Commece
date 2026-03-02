"use client";

import { Badge } from "@/components/ui/badge";

interface ProductPriceProps {
    salePrice: number;
    originalPrice: number;
    discountPercent: number;
    className?: string;
}

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
        <div className={`flex flex-row items-center gap-3 ${className}`}>
            <span
                className="text-2xl font-bold text-red-600"
                itemProp="price"
                content={salePrice.toString()}
            >
                {formatPrice(salePrice)}
            </span>
            {discountPercent > 0 && (
                <>
                    <span className="text-muted-foreground text-lg line-through">
                        {formatPrice(originalPrice)}
                    </span>
                    <Badge
                        variant="outline"
                        className="border-red-200 text-red-600"
                    >
                        Tiết kiệm {formatPrice(originalPrice - salePrice)}
                    </Badge>
                </>
            )}
            <meta itemProp="priceCurrency" content="VND" />
        </div>
    );
}
