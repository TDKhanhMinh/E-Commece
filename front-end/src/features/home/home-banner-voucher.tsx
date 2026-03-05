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

export function VoucherBanner() {
    const { useAdminVouchers, collectVoucher } = useVoucher();

    const { data: voucherPage, isLoading, error } = useAdminVouchers();

    const publicVouchers = voucherPage?.content || [];

    const handleCollect = (code: string) => {
        collectVoucher.mutate(
            { code },
            {
                onSuccess: () => {
                    toast.success(`Đã lưu mã ${code} vào ví của bạn! 🎉`);
                },
                onError: (err: any) => {
                    const msg = err?.message || "Có lỗi xảy ra khi lưu mã";
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
        <div className="my-20 border-y bg-slate-50 py-10 shadow-inner">
            <div className="container mx-auto px-4">
                {/* Tiêu đề Banner */}
                <div className="mb-8 flex items-center gap-3">
                    <div className="rounded-xl bg-red-100 p-2.5">
                        <Sparkles className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                            Ưu đãi HOT hôm nay
                        </h2>
                        <p className="text-slate-600">
                            Lưu ngay mã giảm giá vào ví trước khi mua sắm bạn
                            nhé!
                        </p>
                    </div>
                </div>

                <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {publicVouchers.map((v: VoucherResponse) => (
                        <Card
                            key={v.id}
                            className="group w-95 shrink-0 snap-start overflow-hidden rounded-2xl border-none shadow-md transition-all duration-300 hover:shadow-lg"
                        >
                            <CardContent className="flex h-40 p-0">
                                <div className="relative flex w-1/3 flex-col items-center justify-center border-r border-dashed border-red-700 bg-red-600 p-4 text-white">
                                    <div className="absolute top-0 -right-2 bottom-0 z-10 flex w-4 flex-col justify-between py-1">
                                        {[...Array(8)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="h-2 w-2 rounded-full bg-slate-50"
                                            />
                                        ))}
                                    </div>

                                    <Ticket className="mb-2 h-10 w-10 opacity-30 transition-transform group-hover:scale-110" />
                                    <span className="rounded-md bg-white px-2 py-1 text-base font-black tracking-wider text-red-700 shadow-inner">
                                        {v.code}
                                    </span>
                                </div>

                                <div className="flex w-2/3 flex-col justify-between bg-white p-5">
                                    <div className="space-y-1">
                                        <h3 className="line-clamp-1 text-lg font-extrabold text-slate-950">
                                            {v.description}
                                        </h3>
                                        <p className="text-sm text-slate-600">
                                            Đơn tối thiểu:{" "}
                                            <span className="font-semibold text-slate-800">
                                                {v.minOrder.toLocaleString(
                                                    "vi-VN"
                                                )}
                                                đ
                                            </span>
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            HSD:{" "}
                                            {fDateTime(
                                                new Date(v.endDate),
                                                "dd/MM/yyyy"
                                            )}
                                        </p>
                                    </div>

                                    <div className="flex justify-end pt-2">
                                        <Button
                                            size="sm"
                                            className="gap-2 rounded-full bg-slate-900 px-6 hover:bg-slate-800"
                                            onClick={() =>
                                                handleCollect(v.code)
                                            }
                                            disabled={collectVoucher.isPending}
                                        >
                                            {collectVoucher.isPending && (
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                            )}
                                            Lưu mã
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
