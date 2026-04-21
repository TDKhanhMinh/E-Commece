"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/format-price";

interface CartSummaryProps {
    totalAmount: number;
    totalDiscount: number;
    finalAmount: number;
    totalItems: number;
    onCheckout?: () => void;
    isCheckingOut?: boolean;
    hasSelectedItems?: boolean;
}

export function CartSummary({
    totalAmount,
    totalDiscount,
    finalAmount,
    totalItems,
    onCheckout,
    isCheckingOut = false,
    hasSelectedItems = false,
}: CartSummaryProps) {
    const t = useTranslations("cart.summary");

    return (
        <div className="lg:col-span-1">
            <Card className="sticky top-4 border-none bg-white shadow-md dark:bg-slate-900 dark:border dark:border-slate-800 dark:shadow-slate-950/50">
                <CardContent className="p-4 sm:p-6">
                    <h2 className="mb-4 text-lg sm:text-xl font-bold dark:text-slate-100">
                        {t("title")}
                    </h2>
                    <div className="space-y-3">
                        <div className="text-muted-foreground flex justify-between dark:text-slate-400 text-sm sm:text-base">
                            <span>{t("subtotal")}</span>
                            <span className="dark:text-slate-200">
                                {formatCurrency(totalAmount)}
                            </span>
                        </div>
                        {totalDiscount > 0 && (
                            <div className="text-destructive flex justify-between dark:text-red-400 text-sm sm:text-base">
                                <span>{t("discount")}</span>
                                <span>-{formatCurrency(totalDiscount)}</span>
                            </div>
                        )}
                        <Separator className="my-4 dark:bg-slate-800" />
                        <div className="flex items-baseline justify-between transition-all">
                            <span className="text-base sm:text-lg font-bold dark:text-slate-100">
                                {t("total")}
                            </span>
                            <p className="text-primary text-xl sm:text-2xl font-black dark:text-blue-400">
                                {formatCurrency(finalAmount)}
                            </p>
                        </div>
                        <div className="text-muted-foreground text-[10px] sm:text-xs dark:text-slate-500">
                            {t("totalItems", { count: totalItems })}
                        </div>
                        <Button
                            disabled={
                                totalItems === 0 ||
                                !hasSelectedItems ||
                                isCheckingOut
                            }
                            className="group mt-6 h-12 w-full text-lg font-semibold"
                            onClick={onCheckout}
                        >
                            {isCheckingOut ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    {t("processing")}
                                </>
                            ) : (
                                <>
                                    {t("checkout")}
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </Button>
                        {!hasSelectedItems && totalItems > 0 && (
                            <p className="text-muted-foreground mt-2 text-center text-xs dark:text-slate-500">
                                {t("selectRequired")}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

