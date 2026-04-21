"use client";

import React from "react";
import { useVoucher } from "@/hooks/use-voucher";
import { VoucherResponse } from "@/type/voucher-type";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Sparkles, Ticket } from "lucide-react";
import { toast } from "sonner";
import { fDateTime } from "@/lib/format-date-time";

import { useTranslations } from "next-intl";

export function VoucherBanner() {
    const t = useTranslations("home.vouchers");
    const { useAdminVouchers, collectVoucher } = useVoucher();

    const { data: voucherPage, isLoading, error } = useAdminVouchers();

    const publicVouchers = voucherPage?.content || [];

    const handleCollect = (code: string) => {
        collectVoucher.mutate(
            { code },
            {
                onSuccess: () => {
                    toast.success(t("collectedToast", { code }));
                },
                onError: (err: any) => {
                    const msg = err?.message || t("collectErrorToast");
                    toast.error(msg);

                    if (err?.response?.status === 401) {
                        // Xử lý chuyển hướng đăng nhập nếu cần
                    }
                },
            }
        );
    };

    if (isLoading) {
        return (
            <div className="bg-slate-50 py-10">
                <div className="container mx-auto space-y-4 px-4">
                    <Skeleton className="h-8 w-64 bg-slate-200" />
                    {/* Cập nhật Skeleton cuộn ngang */}
                    <div className="flex gap-6 overflow-hidden">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton
                                key={i}
                                className="h-40 w-[350px] shrink-0 rounded-2xl bg-slate-200"
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error || publicVouchers.length === 0) {
        return null;
    }

    return (
        <div className="my-10 border-y bg-slate-50 py-8 shadow-inner sm:my-16 sm:py-12 lg:my-20 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="container mx-auto px-4">
                {/* Tiêu đề Banner */}
                <div className="mb-6 flex flex-col items-center gap-3 text-center sm:mb-8 sm:flex-row sm:text-left">
                    <div className="rounded-xl bg-red-100 p-2.5 dark:bg-red-900/30">
                        <Sparkles className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl dark:text-slate-100">
                            {t("title")}
                        </h2>
                        <p className="text-sm text-slate-600 sm:text-base dark:text-slate-400">
                            {t("subtitle")}
                        </p>
                    </div>
                </div>

                <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-6 [&::-webkit-scrollbar]:hidden">
                    {publicVouchers.map((v: VoucherResponse) => (
                        <Card
                            key={v.id}
                            className="group w-[280px] shrink-0 snap-start overflow-hidden rounded-2xl border-none shadow-md transition-all duration-300 hover:shadow-lg sm:w-[350px] dark:bg-slate-900 dark:shadow-slate-950/50"
                        >
                            <CardContent className="flex h-36 p-0 sm:h-40">
                                <div className="relative flex w-[35%] flex-col items-center justify-center border-r border-dashed border-red-700 bg-red-600 p-3 text-white sm:w-1/3 sm:p-4 dark:border-red-500/50 dark:bg-red-700">
                                    <div className="absolute top-0 -right-2 bottom-0 z-10 flex w-4 flex-col justify-between py-1">
                                        {[...Array(8)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="h-1.5 w-1.5 rounded-full bg-slate-50 sm:h-2 sm:w-2 dark:bg-slate-900"
                                            />
                                        ))}
                                    </div>

                                    <Ticket className="mb-1 h-8 w-8 opacity-30 transition-transform group-hover:scale-110 sm:mb-2 sm:h-10 sm:w-10" />
                                    <span className="rounded-md bg-white px-1.5 py-0.5 text-xs font-black tracking-wider text-red-700 shadow-inner sm:px-2 sm:py-1 sm:text-base dark:bg-slate-100 dark:text-red-800">
                                        {v.code}
                                    </span>
                                </div>

                                <div className="flex w-[65%] flex-col justify-between bg-white p-4 sm:w-2/3 sm:p-5 dark:bg-slate-900">
                                    <div className="space-y-0.5 sm:space-y-1">
                                        <h3 className="line-clamp-1 text-base font-extrabold text-slate-950 sm:text-lg dark:text-slate-200">
                                            {v.description}
                                        </h3>
                                        <p className="text-xs text-slate-600 sm:text-sm dark:text-slate-400">
                                            {t("minOrderLabel")}{" "}
                                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                {v.minOrder.toLocaleString(
                                                    "vi-VN"
                                                )}
                                                đ
                                            </span>
                                        </p>
                                        <p className="text-[10px] text-slate-500 sm:text-xs dark:text-slate-500">
                                            {t("expiryLabel")}{" "}
                                            {fDateTime(
                                                new Date(v.endDate),
                                                "dd/MM/yyyy"
                                            )}
                                        </p>
                                    </div>

                                    <div className="flex justify-end pt-1 sm:pt-2">
                                        <Button
                                            size="sm"
                                            className="h-8 gap-1.5 rounded-full bg-slate-900 px-4 text-xs hover:bg-slate-800 sm:h-9 sm:gap-2 sm:px-6 sm:text-sm dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                                            onClick={() =>
                                                handleCollect(v.code)
                                            }
                                            disabled={collectVoucher.isPending}
                                        >
                                            {collectVoucher.isPending && (
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                            )}
                                            {t("saveButton")}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>

    );
}
