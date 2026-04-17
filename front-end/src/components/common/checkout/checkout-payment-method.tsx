"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, CreditCard, Wallet } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

interface PaymentMethodProps {
    value: string;
    onValueChange: (value: string) => void;
}
export function PaymentMethodCard({
    value,
    onValueChange,
}: PaymentMethodProps) {
    const t = useTranslations("checkout.payment");
    return (
        <Card className="dark:bg-slate-900/40 border-none bg-white shadow-sm ring-1 ring-slate-200/60 dark:ring-slate-800/50">
            <CardHeader className="pb-3 px-6 pt-6">
                <CardTitle className="dark:text-slate-100 flex items-center gap-2 text-lg font-bold text-slate-800">
                    <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    {t("title")}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <RadioGroup
                    value={value}
                    onValueChange={onValueChange}
                    defaultValue="COD"
                    className="grid gap-4"
                >
                    <div className="flex items-center space-y-0 space-x-3 rounded-xl border p-4 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/50">
                        <RadioGroupItem value="COD" id="cod" />
                        <Label
                            htmlFor="cod"
                            className="flex flex-1 cursor-pointer items-center gap-3 font-normal"
                        >
                            <Banknote className="dark:text-green-400 h-5 w-5 text-green-600" />
                            <div>
                                <p className="dark:text-slate-100 font-bold text-gray-900">
                                    {t("cod.name")}
                                </p>
                                <p className="dark:text-slate-400 text-xs text-slate-500">
                                    {t("cod.description")}
                                </p>
                            </div>
                        </Label>
                    </div>

                    {/* Thanh toán qua Ví điện tử / VNPAY */}
                    <div className="flex items-center space-y-0 space-x-3 rounded-xl border p-4 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/50">
                        <RadioGroupItem value="VNPAY" id="vnpay" />
                        <Label
                            htmlFor="vnpay"
                            className="flex flex-1 cursor-pointer items-center gap-3 font-normal"
                        >
                            <Wallet className="dark:text-blue-300 h-5 w-5 text-blue-500" />
                            <div>
                                <p className="dark:text-slate-100 font-bold text-gray-900">
                                    {t("vnpay.name")}
                                </p>
                                <p className="dark:text-slate-400 text-xs text-slate-500">
                                    {t("vnpay.description")}
                                </p>
                            </div>
                        </Label>
                    </div>

                    {/* Thanh toán qua Ví điện tử Paypal */}
                    <div className="flex items-center space-y-0 space-x-3 rounded-xl border p-4 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/50">
                        <RadioGroupItem value="PAYPAL" id="paypal" />
                        <Label
                            htmlFor="paypal"
                            className="flex flex-1 cursor-pointer items-center gap-3 font-normal"
                        >
                            <Wallet className="dark:text-blue-300 h-5 w-5 text-blue-500" />
                            <div>
                                <p className="dark:text-slate-100 font-bold text-gray-900">
                                    {t("paypal.name")}
                                </p>
                                <p className="dark:text-slate-400 text-xs text-slate-500">
                                    {t("paypal.description")}
                                </p>
                            </div>
                        </Label>
                    </div>
                </RadioGroup>
            </CardContent>
        </Card>
    );
}

