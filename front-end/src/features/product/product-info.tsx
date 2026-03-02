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

interface ProductInfoProps {
    product: any;
    selectedSku: any;
    discountPercent: number;
    salePrice: number;
    originalPrice: number;
    attributeGroups: Record<string, Set<string>>;
    selectedAttributes: Record<string, string>;
    onAttributeChange: (attributeName: string, value: string) => void;
    formatPrice: (price: number) => string;
}

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
        <div className="flex flex-col">
            <ScrollArea className="h-[700px] w-full">
                <div className="flex flex-col pr-4">
                    {discountPercent > 0 && (
                        <Label className="mb-4 w-fit rounded-md bg-gradient-to-r from-yellow-200 to-orange-400 px-4 py-1.5 text-sm font-bold text-black uppercase">
                            Sale {discountPercent}%
                        </Label>
                    )}

                    <div className="mb-4 flex flex-row items-center justify-between">
                        <div className="text-primary font-semibold">
                            SKU: {selectedSku?.skuCode || "N/A"}
                        </div>
                        <div
                            className="flex items-center gap-2"
                            itemProp="aggregateRating"
                            itemScope
                            itemType="https://schema.org/AggregateRating"
                        >
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span
                                className="font-medium"
                                itemProp="ratingValue"
                            >
                                {product.rating || 0}
                            </span>
                            <span className="text-muted-foreground">
                                (
                                <span itemProp="reviewCount">
                                    {product.reviewCount || 0}
                                </span>
                                )
                            </span>
                        </div>
                    </div>

                    <h1
                        className="text-2xl leading-tight font-bold"
                        itemProp="name"
                    >
                        {product.name}
                        {selectedSku?.skuCode ? `-${selectedSku?.skuCode}` : ""}
                    </h1>

                    <ProductPrice
                        salePrice={salePrice}
                        originalPrice={originalPrice}
                        discountPercent={discountPercent}
                        className="mt-4"
                    />

                    {product.variants?.length > 1 && (
                        <div className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
                            <Package className="h-4 w-4" />
                            <span>{product.variants.length} phiên bản</span>
                        </div>
                    )}

                    <Button
                        className="mt-6 rounded-full px-8"
                        size="lg"
                        disabled={
                            !selectedSku?.stock ||
                            selectedSku?.stock === 0 ||
                            addToCart.isPending
                        }
                        onClick={handleAddToCart}
                        aria-label={
                            selectedSku?.stock > 0
                                ? "Thêm vào giỏ hàng"
                                : "Sản phẩm hết hàng"
                        }
                    >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        {addToCart.isPending
                            ? "Đang thêm..."
                            : selectedSku?.stock > 0
                              ? "Thêm vào giỏ hàng"
                              : "Hết hàng"}
                    </Button>

                    <Separator className="my-8" />

                    <ProductVariantSelector
                        attributeGroups={attributeGroups}
                        selectedAttributes={selectedAttributes}
                        onAttributeChange={onAttributeChange}
                        variants={product.variants || []}
                    />

                    <ProductSkuInfo sku={selectedSku} />

                    <Separator className="my-8" />

                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:bg-transparent">
                        {discountPercent > 0 && (
                            <Label className="mb-4 w-fit rounded-md bg-gradient-to-r from-yellow-200 to-orange-400 px-4 py-1.5 text-sm font-bold text-black uppercase">
                                Sale {discountPercent}%
                            </Label>
                        )}

                        <h2 className="mb-2 text-2xl font-bold">
                            {product.name}
                        </h2>

                        {selectedSku && (
                            <p className="text-muted-foreground mb-4 text-sm">
                                SKU: {selectedSku.skuCode}
                            </p>
                        )}

                        <div className="mb-4 flex flex-row items-center gap-3">
                            <span className="text-2xl font-bold text-red-600">
                                {formatCurrency(salePrice)}
                            </span>
                            {discountPercent > 0 && (
                                <span className="text-muted-foreground line-through">
                                    {formatCurrency(originalPrice)}
                                </span>
                            )}
                        </div>

                        <Button
                            className="mb-6 w-full rounded-full px-8"
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

                        <Separator className="mb-6" />

                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem
                                value="1"
                                className="border-b border-slate-200"
                            >
                                <AccordionTrigger className="text-left text-sm font-semibold text-slate-900 hover:no-underline md:text-lg">
                                    Mô tả sản phẩm
                                </AccordionTrigger>
                                <AccordionContent
                                    className="pb-6 text-sm leading-relaxed text-slate-600"
                                    itemProp="description"
                                >
                                    {product.description ||
                                        "Chưa có mô tả chi tiết cho sản phẩm này."}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        <Separator className="my-6" />

                        <ProductWarranty />
                    </div>

                    <ProductSpecifications
                        specifications={product.specifications || []}
                    />
                </div>

                <ScrollBar orientation="vertical" />
            </ScrollArea>
        </div>
    );
}
