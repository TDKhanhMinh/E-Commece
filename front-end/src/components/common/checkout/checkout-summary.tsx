"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Coins, Loader2, Ticket, Truck } from "lucide-react";
import { BackButton } from "@/components/common/ui/back-button";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/format-price";

interface CheckoutSummary {
    totalAmount: number; // Tổng tiền gốc
    totalDiscount: number; // Giảm giá trực tiếp từ sản phẩm (nếu có)
    finalAmount: number; // Tiền sau khi trừ giảm giá sản phẩm (Tạm tính)
    totalItems: number;
}

interface CheckoutSummaryProps {
    summary: CheckoutSummary;
    hasAddresses: boolean;
    isProcessing: boolean;
    voucherDiscount?: number; // Giảm giá từ Voucher
    pointsDiscount?: number; // Giảm giá từ Điểm tích lũy
    shippingFee?: number; // Phí vận chuyển
    onConfirmOrder: () => void;
}

export function CheckoutSummaryCard({
    summary,
    hasAddresses,
    isProcessing,
    voucherDiscount = 0,
    pointsDiscount = 0,
    shippingFee = 0,
    onConfirmOrder,
}: CheckoutSummaryProps) {
    const t = useTranslations("checkout.summary");

    const displayFinalAmount = Math.max(
        0,
        summary.finalAmount + shippingFee - voucherDiscount - pointsDiscount
    );

    return (
        <Card className="dark:bg-slate-950 sticky top-4 border-none bg-white shadow-sm">
            <CardHeader className="pb-4">
                <CardTitle className="dark:text-neutral-100 text-lg font-bold text-slate-800">
                    {t("title")}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    {/* Tạm tính */}
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                        <span>{t("subtotal", { count: summary.totalItems })}</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                            {formatCurrency(summary.finalAmount)}
                        </span>
                    </div>

                    {/* Phí vận chuyển */}
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1.5">
                            <Truck className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                            {t("shippingFee")}
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                            {shippingFee > 0
                                ? `+${formatCurrency(shippingFee)}`
                                : t("free")}
                        </span>
                    </div>

                    {/* Giảm giá Voucher */}
                    {voucherDiscount > 0 && (
                        <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
                            <span className="flex items-center gap-1.5">
                                <Ticket className="h-4 w-4" />
                                {t("voucherDiscount")}
                            </span>
                            <span className="font-semibold">
                                -{formatCurrency(voucherDiscount)}
                            </span>
                        </div>
                    )}

                    {/* Giảm giá Điểm thưởng */}
                    {pointsDiscount > 0 && (
                        <div className="flex justify-between text-sm text-amber-600 dark:text-amber-400">
                            <span className="flex items-center gap-1.5">
                                <Coins className="h-4 w-4" />
                                {t("pointsUsage")}
                            </span>
                            <span className="font-semibold">
                                -{formatCurrency(pointsDiscount)}
                            </span>
                        </div>
                    )}

                    <Separator className="my-2" />

                    {/* Tổng cộng */}
                    <div className="flex items-end justify-between">
                        <span className="dark:text-slate-100 text-base font-bold text-slate-800">
                            {t("total")}
                        </span>
                        <div className="text-right">
                            <span className="text-primary text-2xl font-bold">
                                {formatCurrency(displayFinalAmount)}
                            </span>
                            <p className="text-muted-foreground dark:text-slate-500 mt-1 text-[11px]">
                                {t("vatIncluded")}
                            </p>
                        </div>
                    </div>
                </div>

                <Button
                    className="mt-2 h-12 w-full rounded-xl text-base font-bold"
                    onClick={onConfirmOrder}
                    disabled={isProcessing || !hasAddresses}
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            {t("processing")}
                        </>
                    ) : (
                        t("confirm")
                    )}
                </Button>

                {!hasAddresses && (
                    <p className="text-destructive text-center text-xs font-medium">
                        {t("addressRequiredHint")}
                    </p>
                )}

                <BackButton />

                <div className="dark:border-blue-900/30 dark:bg-blue-950/20 rounded-lg border border-blue-100/50 bg-blue-50/50 p-3">
                    <p className="dark:text-blue-300 text-[11px] leading-relaxed text-blue-800">
                        💡 {t.rich("terms", {
                            link: (chunks) => (
                                <a
                                    href="#"
                                    className="dark:text-blue-400 dark:hover:text-blue-300 font-semibold underline hover:text-blue-900"
                                >
                                    {chunks}
                                </a>
                            ),
                        })}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

