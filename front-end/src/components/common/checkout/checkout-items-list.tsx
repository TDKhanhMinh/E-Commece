"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "@/lib/format-price";
import { useTranslations } from "next-intl";
import { CheckoutItem } from "./types";

interface CheckoutItemsListProps {
    items: CheckoutItem[];
}

export function CheckoutItemsList({ items }: CheckoutItemsListProps) {
    const t = useTranslations("checkout.items");
    return (
        <Card className="dark:bg-slate-900/40 overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200/60 dark:ring-slate-800/50">
            <CardHeader className="dark:bg-slate-800/30 border-b border-slate-50 bg-slate-50/50 px-4 py-3 sm:px-6 sm:py-4 dark:border-slate-800/50">
                <CardTitle className="dark:text-slate-100 flex items-center gap-2 text-base font-bold sm:text-lg text-slate-800">
                    <ShoppingBag className="h-5 w-5 text-blue-600" />
                    {t("title", { count: items.length })}
                </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-slate-50 p-0 dark:divide-slate-800/50">
                {items.map((item) => (
                    <div
                        key={item.skuId}
                        className="group flex gap-3 p-4 sm:gap-4 sm:p-6 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                    >
                        <div className="h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 focus-within:ring-2 focus-within:ring-blue-500">
                            <Image
                                src={item.image}
                                alt={item.productName}
                                width={96}
                                height={96}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                        </div>

                        <div className="flex flex-1 flex-col justify-between min-w-0">
                            <div className="space-y-1">
                                <h4 className="dark:text-slate-100 line-clamp-1 text-sm sm:text-base font-bold text-slate-900">
                                    {item.productName}
                                </h4>
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    {Object.entries(item.attributes).map(([key, value]) => (
                                        <Badge
                                            key={key}
                                            variant="outline"
                                            className="dark:bg-slate-800 dark:text-slate-400 bg-slate-50 text-[9px] sm:text-[10px] px-1.5 py-0 text-slate-500"
                                        >
                                            {key}: {value}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0 mt-2">
                                <div className="flex items-baseline gap-2">
                                    <span className="dark:text-blue-400 text-base sm:text-lg font-black text-blue-600">
                                        {formatCurrency(item.salePrice || item.price)}
                                    </span>
                                    {item.salePrice && item.salePrice < item.price && (
                                        <span className="dark:text-slate-500 text-[10px] sm:text-xs text-slate-400 line-through">
                                            {formatCurrency(item.price)}
                                        </span>
                                    )}
                                    <span className="text-xs sm:text-sm font-medium text-slate-400">
                                        x{item.quantity}
                                    </span>
                                </div>
                                <div className="dark:text-slate-200 text-sm font-bold text-slate-900 sm:text-right">
                                    {formatCurrency(item.subtotal)}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
