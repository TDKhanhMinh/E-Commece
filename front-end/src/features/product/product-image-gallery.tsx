"use client";

import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ProductImageGalleryProps } from "@/type/product-type";

export function ProductImageGallery({
    images,
    currentImageIndex,
    onImageChange,
    productName,
    discountPercent,
}: ProductImageGalleryProps) {
    const currentImage =
        images[currentImageIndex] || "/placeholder-product.png";

    return (
        <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
            <div className="flex flex-col items-center">
                {/* Main Image */}
                <div className="relative aspect-square w-full max-w-[500px] overflow-hidden rounded-xl bg-gray-50 sm:max-w-none sm:rounded-2xl lg:aspect-[4/5]">
                    <Image
                        src={currentImage}
                        alt={productName}
                        fill
                        className="object-contain transition-transform hover:scale-105"
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                        itemProp="image"
                    />

                    {/* Discount Badge */}
                    {discountPercent > 0 && (
                        <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 px-3 py-1 text-xs font-bold text-white sm:top-4 sm:left-4 sm:text-sm">
                            SALE {discountPercent}%
                        </Badge>
                    )}
                </div>

                {/* Thumbnail Images */}
                <ScrollArea className="mt-4 w-full sm:mt-6 lg:mt-8">
                    <div className="flex gap-2 px-1 pb-4 sm:gap-3">
                        {images.map((image, index) => (
                            <button
                                key={index}
                                className={`hover:border-primary relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-all sm:h-20 sm:w-20 ${
                                    currentImageIndex === index
                                        ? "border-primary ring-primary/20 ring-2"
                                        : "border-gray-200"
                                }`}
                                onClick={() => onImageChange(index)}
                                aria-label={`Xem ảnh ${index + 1} của ${productName}`}
                            >
                                <Image
                                    src={image}
                                    alt={`${productName} - Ảnh ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 64px, 80px"
                                />
                            </button>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </div>
    );
}
