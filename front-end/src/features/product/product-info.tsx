"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Package, ShoppingCart, Star } from "lucide-react";
import { ProductPrice } from "./product-price";
import { ProductVariantSelector } from "./product-variant-selector";
import { ProductSkuInfo } from "./product-sku-info";
import { ProductWarranty } from "./product-warranty";
import { ProductSpecifications } from "./product-specifications";
import { useAddToCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format-price";
import { ProductInfoProps } from "@/type/product-type";

export function ProductInfo({
    product,
    selectedSku,
    discountPercent,
    salePrice,
    originalPrice,
    attributeGroups,
    selectedAttributes,
    onAttributeChange,
}: ProductInfoProps) {
    const addToCart = useAddToCart();

    const handleAddToCart = () => {
        if (!selectedSku) {
            toast.error("Vui lòng chọn phiên bản sản phẩm!");
            return;
        }

        if (!selectedSku.stock || selectedSku.stock === 0) {
            toast.error("Sản phẩm hiện đang hết hàng!");
            return;
        }

        addToCart.mutate({
            skuId: selectedSku.id,
            quantity: 1,
        });
    };
    return (
        <div className="flex flex-col lg:h-[700px]">
            <ScrollArea className="h-full w-full">
                <div className="flex flex-col pr-0 lg:pr-4">
                    {discountPercent > 0 && (
                        <Label className="mb-4 w-fit rounded-md bg-gradient-to-r from-yellow-200 to-orange-400 px-3 py-1.5 text-xs font-bold text-black uppercase sm:px-4 sm:text-sm">
                            Sale {discountPercent}%
                        </Label>
                    )}

                    <div className="mb-3 flex items-center justify-between sm:mb-4">
                        <div className="text-primary text-sm font-semibold dark:text-blue-400 sm:text-base">
                            SKU: {selectedSku?.skuCode || "N/A"}
                        </div>
                        <div
                            className="flex items-center gap-2"
                            itemProp="aggregateRating"
                            itemScope
                            itemType="https://schema.org/AggregateRating"
                        >
                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 sm:h-4 sm:w-4" />
                            <span
                                className="text-sm font-medium sm:text-base dark:text-slate-100"
                                itemProp="ratingValue"
                            >
                                {product.rating || 0}
                            </span>
                            <span className="text-muted-foreground text-xs sm:text-sm dark:text-slate-400">
                                (
                                <span itemProp="reviewCount">
                                    {product.reviewCount || 0}
                                </span>
                                )
                            </span>
                        </div>
                    </div>

                    <h1
                        className="text-xl leading-tight font-bold sm:text-2xl lg:text-3xl dark:text-slate-100"
                        itemProp="name"
                    >
                        {product.name}
                        {selectedSku?.skuCode ? `-${selectedSku?.skuCode}` : ""}
                    </h1>

                    <ProductPrice
                        salePrice={salePrice}
                        originalPrice={originalPrice}
                        discountPercent={discountPercent}
                        className="mt-4 sm:mt-6"
                    />

                    {product.variants?.length > 1 && (
                        <div className="text-muted-foreground mt-3 flex items-center gap-2 text-sm dark:text-slate-400">
                            <Package className="h-4 w-4" />
                            <span>{product.variants.length} phiên bản</span>
                        </div>
                    )}

                    {/* Primary CTA Area - Simplified for Mobile */}
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-8">
                        <Button
                            className="h-12 flex-1 rounded-full px-8 text-base font-semibold sm:h-14"
                            size="lg"
                            disabled={
                                !selectedSku?.stock ||
                                selectedSku?.stock === 0 ||
                                addToCart.isPending
                            }
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            {addToCart.isPending
                                ? "Đang thêm..."
                                : selectedSku?.stock > 0
                                  ? "Thêm vào giỏ hàng"
                                  : "Hết hàng"}
                        </Button>
                    </div>

                    <Separator className="my-6 sm:my-8" />

                    <div className="space-y-6 sm:space-y-8">
                        <ProductVariantSelector
                            attributeGroups={attributeGroups}
                            selectedAttributes={selectedAttributes}
                            onAttributeChange={onAttributeChange}
                            variants={product.variants || []}
                        />

                        <ProductSkuInfo sku={selectedSku} />
                    </div>

                    <Separator className="my-6 sm:my-8 dark:bg-slate-800" />

                    {/* Secondary Product Details Box */}
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 sm:rounded-2xl sm:p-6 lg:p-8 dark:border-slate-800 dark:bg-slate-900/50">
                        <h2 className="mb-4 text-lg font-bold sm:text-xl lg:text-2xl dark:text-slate-100">
                            Chi tiết sản phẩm
                        </h2>

                        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                            <span className="text-2xl font-bold text-red-600 sm:text-3xl dark:text-red-400">
                                {formatCurrency(salePrice)}
                            </span>
                            {discountPercent > 0 && (
                                <span className="text-muted-foreground text-sm line-through sm:text-base dark:text-slate-500">
                                    {formatCurrency(originalPrice)}
                                </span>
                            )}
                        </div>

                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem
                                value="description"
                                className="border-b border-slate-200 dark:border-slate-800"
                            >
                                <AccordionTrigger className="py-4 text-left text-sm font-semibold text-slate-900 hover:no-underline sm:text-base dark:text-slate-100">
                                    Mô tả đầy đủ
                                </AccordionTrigger>
                                <AccordionContent
                                    className="pb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
                                    itemProp="description"
                                >
                                    {product.description ||
                                        "Chưa có mô tả chi tiết cho sản phẩm này."}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        <div className="mt-8">
                            <ProductWarranty />
                        </div>
                    </div>

                    <div className="mt-8 lg:mt-12">
                        <ProductSpecifications
                            specifications={product.specifications || []}
                        />
                    </div>
                </div>

                <ScrollBar orientation="vertical" />
            </ScrollArea>
        </div>
    );
}
