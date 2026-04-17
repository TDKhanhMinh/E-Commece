"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";

interface CheckoutItem {
    skuId: number;
    skuCode: string;
    productName: string;
    image: string;
    attributes: Record<string, string>;
    price: number;
    salePrice?: number;
    discountPercent?: number;
    quantity: number;
    subtotal: number;
}

interface CheckoutItemsListProps {
    items: CheckoutItem[];
}

export function CheckoutItemsList({ items }: CheckoutItemsListProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-neutral-100">
                    <ShoppingBag className="text-primary h-5 w-5" />
                    Sản phẩm đã chọn ({items.length})
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item.skuId} className="flex gap-4">
                            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                                <Image
                                    src={item.image}
                                    alt={item.productName}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-1 flex-col justify-between">
                                <div>
                                    <h3 className="font-semibold dark:text-slate-200">
                                        {item.productName}
                                    </h3>
                                    <p className="text-muted-foreground text-sm dark:text-slate-400">
                                        {Object.entries(item.attributes)
                                            .map(
                                                ([key, value]) =>
                                                    `${key}: ${value}`
                                            )
                                            .join(" • ")}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground text-sm">
                                        x{item.quantity}
                                    </span>
                                    <div className="text-right">
                                        {item.salePrice &&
                                        item.salePrice < item.price ? (
                                            <>
                                                <p className="text-primary font-semibold">
                                                    {item.salePrice.toLocaleString(
                                                        "vi-VN"
                                                    )}
                                                    đ
                                                </p>
                                                <p className="text-muted-foreground text-xs line-through dark:text-slate-500">
                                                    {item.price.toLocaleString(
                                                        "vi-VN"
                                                    )}
                                                    đ
                                                </p>
                                            </>
                                        ) : (
                                            <p className="font-semibold dark:text-slate-200">
                                                {item.price.toLocaleString(
                                                    "vi-VN"
                                                )}
                                                đ
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
