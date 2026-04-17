"use client";

import { Button } from "@/components/ui/button";
import { SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Loader2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart, useCartSummary } from "@/hooks/use-cart";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartItemResponse } from "@/type/cart-type";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/format-price";

export function CartSheet() {
    const t = useTranslations("cart.sheet");
    const { data: cart, isLoading } = useCart();
    const summary = useCartSummary();

    // Trạng thái trống
    //@ts-ignore
    if (!isLoading && (!cart || !cart.items || cart.items.length === 0)) {
        return (
            <SheetContent className="flex h-full w-full flex-col p-4 sm:max-w-lg dark:bg-slate-900 dark:border-slate-800">
                <SheetTitle className="border-b pb-4 dark:border-slate-800 dark:text-slate-100">
                    {t("title")}
                </SheetTitle>
                <div className="flex flex-1 flex-col items-center justify-center space-y-4">
                    <div className="bg-muted rounded-full p-6 dark:bg-slate-800">
                        <ShoppingCart className="text-muted-foreground h-12 w-12 dark:text-slate-400" />
                    </div>
                    <div className="text-center">
                        <span className="block text-lg font-semibold dark:text-slate-100">
                            {t("empty.title")}
                        </span>
                        <p className="text-muted-foreground mt-1 max-w-[280px] text-sm">
                            {t("empty.description")}
                        </p>
                    </div>
                    <SheetClose asChild>
                        <Link href="/">
                            <Button className="rounded-2xl px-8" size="lg">
                                {t("empty.button")}
                            </Button>
                        </Link>
                    </SheetClose>
                </div>
            </SheetContent>
        );
    }

    // Trạng thái loading
    if (isLoading) {
        return (
            <SheetContent className="h-full w-full p-4 sm:max-w-lg dark:bg-slate-900">
                <SheetTitle className="border-b pb-4 dark:border-slate-800 dark:text-slate-100">
                    {t("title")}
                </SheetTitle>
                <div className="flex h-full flex-col items-center justify-center gap-2">
                    <Loader2 className="text-primary h-8 w-8 animate-spin dark:text-blue-400" />
                    <p className="text-muted-foreground text-sm font-medium dark:text-slate-400">
                        {t("loading")}
                    </p>
                </div>
            </SheetContent>
        );
    }

    return (
        // make container a flex column that can shrink (min-h-0) so the middle ScrollArea can scroll
        <SheetContent className="flex h-full min-h-0 w-full flex-col overflow-hidden p-0 sm:max-w-lg dark:bg-slate-900 dark:border-slate-800">
            <div className="shrink-0 border-b p-4 shadow-sm dark:border-slate-800 dark:shadow-slate-950/50">
                <SheetTitle className="text-xl font-bold dark:text-slate-100">
                    {t("itemsCount", { count: summary.itemCount })}
                </SheetTitle>
            </div>

            {/* make the middle area explicitly scrollable and fill remaining space */}
            <ScrollArea className="flex-1 overflow-auto px-4 py-2">
                {/* add bottom padding so last items aren't hidden behind the fixed footer */}
                <div className="my-4 space-y-4 pr-3 pb-6">
                    {//@ts-ignore
                    cart?.items.map((item: CartItemResponse) => (
                        <div
                            key={item.id}
                            className="group bg-card hover:border-primary/50 relative flex gap-4 rounded-xl border p-3 transition-all hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/50 dark:hover:shadow-slate-950/50"
                        >
                            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-white p-1 dark:bg-slate-800 dark:border-slate-700">
                                <img
                                    src={
                                        //@ts-ignore
                                        item?.productImage || "/placeholder.png"
                                    }
                                    alt={item.productName}
                                    className="h-full w-full object-contain transition-transform group-hover:scale-105"
                                />
                            </div>

                            <div className="flex flex-1 flex-col justify-between py-0.5">
                                <div className="">
                                    <h4 className="line-clamp-1 text-sm font-bold text-gray-900 dark:text-slate-100">
                                        {item.productName}
                                    </h4>
                                    <div className="mt-1 flex flex-wrap gap-1">
                                        {Object.entries(
                                            item.attributes || {}
                                        ).map(([key, value]) => (
                                            <span
                                                key={key}
                                                className="bg-muted text-muted-foreground inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium dark:bg-slate-800 dark:text-slate-400"
                                            >
                                                {value}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-2 flex items-end justify-between">
                                    <span className="text-muted-foreground rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold dark:bg-slate-800 dark:text-slate-400">
                                        {t("qty")}: {item.quantity}
                                    </span>
                                    <div className="text-right">
                                        {item.salePrice &&
                                        item.salePrice < item.price ? (
                                            <div className="flex flex-col items-end leading-tight">
                                                <span className="text-muted-foreground text-[10px] line-through decoration-gray-400 dark:text-slate-500 dark:decoration-slate-600">
                                                    {formatCurrency(item.price)}
                                                </span>
                                                <span className="text-primary text-sm font-black dark:text-blue-400">
                                                    {formatCurrency(
                                                        item.salePrice
                                                    )}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-primary text-sm font-black dark:text-blue-400">
                                                {formatCurrency(item.price)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <div className="shrink-0 border-t bg-slate-50/80 p-5 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] backdrop-blur-sm dark:bg-slate-900/80 dark:border-slate-800 dark:shadow-slate-950/50">
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-medium dark:text-slate-400">
                            {t("subtotal", { count: summary.itemCount })}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-slate-100">
                            {formatCurrency(summary.totalAmount)}
                        </span>
                    </div>

                    {summary.totalDiscount > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground font-medium dark:text-slate-400">
                                {t("discount")}
                            </span>
                            <span className="text-destructive font-bold dark:text-red-400">
                                -{formatCurrency(summary.totalDiscount)}
                            </span>
                        </div>
                    )}

                    <Separator className="bg-slate-200 dark:bg-slate-800" />
                    <div className="flex items-center justify-between pt-1">
                        <span className="text-base font-bold text-gray-900 dark:text-slate-100">
                            {t("total")}
                        </span>
                        <span className="text-primary text-2xl font-black tracking-tight dark:text-blue-400">
                            {formatCurrency(summary.finalAmount)}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2 pt-2">
                        <SheetClose asChild>
                            <Link href="/cart">
                                <Button
                                    className="shadow-primary/20 h-12 w-full rounded-2xl text-base font-bold shadow-lg transition-all hover:scale-[1.01] active:scale-[0.98]"
                                    size="lg"
                                >
                                    {t("checkout")}
                                </Button>
                            </Link>
                        </SheetClose>
                    </div>
                </div>
            </div>
        </SheetContent>
    );
}

