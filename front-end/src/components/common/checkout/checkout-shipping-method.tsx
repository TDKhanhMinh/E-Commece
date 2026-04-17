"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ShippingMethodProps {
    value: string;
    onValueChange: (value: string) => void;
}
export function ShippingMethodCard({
    value,
    onValueChange,
}: ShippingMethodProps) {
    return (
        <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-bold dark:text-neutral-100">
                    <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Phương thức vận chuyển
                </CardTitle>
            </CardHeader>
            <CardContent>
                <RadioGroup
                    value={value}
                    onValueChange={onValueChange}
                    defaultValue="standard"
                    className="grid gap-4"
                >
                    <div className="flex items-center space-y-0 space-x-3 rounded-xl border p-4 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/50">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label
                            htmlFor="standard"
                            className="flex flex-1 cursor-pointer items-center justify-between font-normal"
                        >
                            <div>
                                <p className="font-bold text-gray-900 dark:text-slate-100">
                                    Giao hàng tiêu chuẩn
                                </p>
                                <p className="text-muted-foreground text-xs dark:text-slate-400">
                                    Nhận hàng sau 2-4 ngày làm việc
                                </p>
                            </div>
                            <span className="font-bold text-blue-600 dark:text-blue-400">
                                Miễn phí
                            </span>
                        </Label>
                    </div>

                    <div className="flex items-center space-y-0 space-x-3 rounded-xl border p-4 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/50">
                        <RadioGroupItem value="express" id="express" />
                        <Label
                            htmlFor="express"
                            className="flex flex-1 cursor-pointer items-center justify-between font-normal"
                        >
                            <div>
                                <p className="font-bold text-gray-900 dark:text-slate-100">
                                    Giao hàng hỏa tốc
                                </p>
                                <p className="text-muted-foreground text-xs dark:text-slate-400">
                                    Nhận hàng ngay trong ngày
                                </p>
                            </div>
                            <span className="font-bold text-blue-600 dark:text-blue-400">
                                30.000đ
                            </span>
                        </Label>
                    </div>
                </RadioGroup>
            </CardContent>
        </Card>
    );
}
