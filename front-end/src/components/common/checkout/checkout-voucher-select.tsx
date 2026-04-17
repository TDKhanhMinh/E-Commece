"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, Loader2, Ticket } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useVoucher } from "@/hooks/use-voucher";

interface VoucherSelectorProps {
    onApplyVoucher: (code: string) => void;
    appliedVoucher?: string;
}

export function VoucherSelector({
    onApplyVoucher,
    appliedVoucher,
}: VoucherSelectorProps) {
    const [inputValue, setInputValue] = useState("");
    const [open, setOpen] = useState(false);

    const { useMyVouchers } = useVoucher();
    const { data: voucherPage, isLoading } = useMyVouchers();

    const myVouchers = voucherPage?.content || [];

    const handleSelectVoucher = (code: string) => {
        onApplyVoucher(code);
        setOpen(false);
    };

    return (
        <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-bold dark:text-neutral-100">
                    <Ticket className="h-5 w-5 text-red-500 dark:text-red-400" />
                    Mã giảm giá
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* 1. Nhập mã thủ công */}
                <div className="flex gap-2">
                    <Input
                        placeholder="Nhập mã giảm giá..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="rounded-xl bg-slate-50/50 dark:bg-slate-900/50 dark:border-slate-800"
                    />
                    <Button
                        variant="secondary"
                        onClick={() => onApplyVoucher(inputValue)}
                        disabled={!inputValue}
                        className="rounded-xl px-6"
                    >
                        Áp dụng
                    </Button>
                </div>

                {/* 2. Chọn từ danh sách sử dụng Popover */}
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <div className="group flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-red-200 bg-red-50/50 p-3 transition-all hover:border-red-300 hover:bg-red-50 dark:border-red-900/50 dark:bg-red-950/20 dark:hover:border-red-800 dark:hover:bg-red-900/10">
                            <div className="flex items-center gap-2">
                                <Ticket className="h-4 w-4 text-red-500 dark:text-red-400" />
                                <span className="text-sm font-medium text-red-700 dark:text-red-300">
                                    {appliedVoucher
                                        ? `Đang áp dụng: ${appliedVoucher}`
                                        : "Chọn voucher từ kho của bạn"}
                                </span>
                            </div>
                            <ChevronRight
                                className={`h-4 w-4 text-red-400 transition-transform dark:text-red-600 ${open ? "rotate-90" : ""}`}
                            />
                        </div>
                    </PopoverTrigger>

                    <PopoverContent
                        className="border-red-100 p-0 shadow-xl dark:border-red-900 dark:bg-slate-950"
                        align="start"
                        style={{ width: "var(--radix-popover-trigger-width)" }}
                    >
                        <div className="border-b bg-red-50/50 p-3 dark:bg-red-950/20 dark:border-red-900">
                            <p className="text-sm font-bold text-red-800 dark:text-red-300">
                                Kho Voucher của bạn
                            </p>
                        </div>

                        <ScrollArea className="h-72 w-full">
                            {isLoading ? (
                                <div className="flex h-full items-center justify-center p-6 text-slate-500">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang tải kho voucher...
                                </div>
                            ) : (
                                <div className="space-y-3 p-3">
                                    {/* Map dữ liệu từ API */}
                                    {myVouchers.map((uv: any) => {
                                        // Thông tin chi tiết nằm trong object voucher lồng bên trong
                                        const v = uv.voucher;
                                        if (!v) return null;

                                        return (
                                            <div
                                                key={uv.id}
                                                className={`relative flex cursor-pointer flex-col gap-1 rounded-xl border p-4 transition-all ${
                                                    appliedVoucher === v.code
                                                        ? "border-red-500 bg-red-50 ring-1 ring-red-500/20 dark:bg-red-950/30"
                                                        : "border-slate-100 hover:border-red-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/50"
                                                }`}
                                                onClick={() =>
                                                    handleSelectVoucher(v.code)
                                                }
                                            >
                                                <div className="flex items-center justify-between">
                                                    <Badge
                                                        variant="outline"
                                                        className={`font-bold ${
                                                            appliedVoucher ===
                                                            v.code
                                                                ? "border-red-500 bg-red-500 text-white"
                                                                : "border-red-500 text-red-500"
                                                        }`}
                                                    >
                                                        {v.code}
                                                    </Badge>
                                                    {appliedVoucher ===
                                                        v.code && (
                                                        <div className="rounded-full bg-red-500 p-0.5">
                                                            <Check className="h-3 w-3 text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="mt-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                                                    {v.description}
                                                </p>
                                                <div className="mt-1 flex items-center justify-between">
                                                    <p className="text-muted-foreground text-[11px] dark:text-slate-500">
                                                        Đơn tối thiểu:{" "}
                                                        <span className="font-semibold dark:text-slate-400">
                                                            {v.minOrder.toLocaleString(
                                                                "vi-VN"
                                                            )}
                                                            đ
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {myVouchers.length === 0 && (
                                        <div className="py-10 text-center">
                                            <p className="text-sm text-slate-400">
                                                Bạn chưa có mã giảm giá nào
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </ScrollArea>
                    </PopoverContent>
                </Popover>
            </CardContent>
        </Card>
    );
}
