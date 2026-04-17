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
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/format-price";

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
    const t = useTranslations("checkout.voucher");

    const { useMyVouchers } = useVoucher();
    const { data: voucherPage, isLoading } = useMyVouchers();

    const myVouchers = voucherPage?.content || [];

    const handleSelectVoucher = (code: string) => {
        onApplyVoucher(code);
        setOpen(false);
    };

    return (
        <Card className="dark:bg-slate-900/40 border-none bg-white shadow-sm ring-1 ring-slate-200/60 dark:ring-slate-800/50">
            <CardHeader className="pb-3 px-6 pt-6">
                <CardTitle className="dark:text-slate-100 flex items-center gap-2 text-lg font-bold text-slate-800">
                    <Ticket className="dark:text-red-400 h-5 w-5 text-red-500" />
                    {t("title")}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
                {/* 1. Nhập mã thủ công */}
                <div className="flex gap-2">
                    <Input
                        placeholder={t("placeholder")}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="dark:border-slate-800 dark:bg-slate-900/50 rounded-xl bg-slate-50/50"
                    />
                    <Button
                        variant="secondary"
                        onClick={() => onApplyVoucher(inputValue)}
                        disabled={!inputValue}
                        className="rounded-xl px-6"
                    >
                        {t("apply")}
                    </Button>
                </div>

                {/* 2. Chọn từ danh sách sử dụng Popover */}
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <div className="dark:border-red-900/50 dark:bg-red-950/20 dark:hover:border-red-800 dark:hover:bg-red-900/10 group flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-red-200 bg-red-50/50 p-3 transition-all hover:border-red-300 hover:bg-red-50">
                            <div className="flex items-center gap-2">
                                <Ticket className="dark:text-red-400 h-4 w-4 text-red-500" />
                                <span className="dark:text-red-300 text-sm font-medium text-red-700">
                                    {appliedVoucher
                                        ? t("applied", { code: appliedVoucher })
                                        : t("select")}
                                </span>
                            </div>
                            <ChevronRight
                                className={`dark:text-red-600 h-4 w-4 text-red-400 transition-transform ${open ? "rotate-90" : ""}`}
                            />
                        </div>
                    </PopoverTrigger>

                    <PopoverContent
                        className="dark:border-red-900 dark:bg-slate-950 border-red-100 p-0 shadow-xl"
                        align="start"
                        style={{ width: "var(--radix-popover-trigger-width)" }}
                    >
                        <div className="dark:bg-red-950/20 dark:border-red-900 border-b bg-red-50/50 p-3">
                            <p className="dark:text-red-300 text-sm font-bold text-red-800">
                                {t("wallet")}
                            </p>
                        </div>

                        <ScrollArea className="h-72 w-full">
                            {isLoading ? (
                                <div className="flex h-full items-center justify-center p-6 text-slate-500">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t("loading")}
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
                                                        ? "dark:bg-red-950/30 border-red-500 bg-red-50 ring-1 ring-red-500/20"
                                                        : "dark:border-slate-800 dark:hover:bg-slate-900/50 border-slate-100 hover:border-red-200 hover:bg-slate-50"
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
                                                <p className="dark:text-slate-200 mt-2 text-sm font-bold text-slate-800">
                                                    {v.description}
                                                </p>
                                                <div className="mt-1 flex items-center justify-between">
                                                    <p className="dark:text-slate-500 text-muted-foreground text-[11px]">
                                                        {t("minOrder", {
                                                            amount: formatCurrency(
                                                                v.minOrder
                                                            ),
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {myVouchers.length === 0 && (
                                        <div className="py-10 text-center">
                                            <p className="text-sm text-slate-400">
                                                {t("noVouchers")}
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

