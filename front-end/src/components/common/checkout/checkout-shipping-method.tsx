"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/format-price";

interface ShippingMethodProps {
    value: string;
    onValueChange: (value: string) => void;
}
export function ShippingMethodCard({
    value,
    onValueChange,
}: ShippingMethodProps) {
    const t = useTranslations("checkout.shipping");
    return (
        <Card className="dark:bg-slate-900/40 border-none bg-white shadow-sm ring-1 ring-slate-200/60 dark:ring-slate-800/50">
            <CardHeader className="pb-3 px-6 pt-6">
                <CardTitle className="dark:text-slate-100 flex items-center gap-2 text-lg font-bold text-slate-800">
                    <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    {t("title")}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
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
                                <p className="dark:text-slate-100 font-bold text-gray-900">
                                    {t("standard.name")}
                                </p>
                                <p className="dark:text-slate-400 text-xs text-slate-500">
                                    {t("standard.description")}
                                </p>
                            </div>
                            <span className="dark:text-blue-400 font-bold text-blue-600">
                                {t("standard.price")}
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
                                <p className="dark:text-slate-100 font-bold text-gray-900">
                                    {t("express.name")}
                                </p>
                                <p className="dark:text-slate-400 text-xs text-slate-500">
                                    {t("express.description")}
                                </p>
                            </div>
                            <span className="dark:text-blue-400 font-bold text-blue-600">
                                {t("express.price")}
                            </span>
                        </Label>
                    </div>
                </RadioGroup>
            </CardContent>
        </Card>
    );
}

