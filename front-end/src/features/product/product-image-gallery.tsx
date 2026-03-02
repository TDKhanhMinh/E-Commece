"use client";

import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ProductImageGalleryProps {
    images: string[];
    currentImageIndex: number;
    onImageChange: (index: number) => void;
    productName: string;
    discountPercent: number;
}

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
        <div className="flex flex-col">
            <div className="flex flex-col items-center">
                {/* Main Image */}
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-50">
                    <Image
                        src={currentImage}
                        alt={productName}
                        fill
                        className="object-contain transition-transform hover:scale-105"
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        itemProp="image"
                    />

                    {/* Discount Badge */}
                    {discountPercent > 0 && (
                        <Badge className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white">
                            SALE {discountPercent}%
                        </Badge>
                    )}
                </div>

                {/* Thumbnail Images */}
                <ScrollArea className="mt-8 w-full">
                    <div className="flex gap-3 px-4">
                        {images.map((image, index) => (
                            <button
                                key={index}
                                className={`hover:border-primary relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
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
                                    sizes="80px"
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
