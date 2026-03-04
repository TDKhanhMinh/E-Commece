"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, CreditCard, Wallet } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PaymentMethodProps {
    value: string;
    onValueChange: (value: string) => void;
}
export function PaymentMethodCard({
    value,
    onValueChange,
}: PaymentMethodProps) {
    return (
        <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    Phương thức thanh toán
                </CardTitle>
            </CardHeader>
            <CardContent>
                <RadioGroup
                    value={value}
                    onValueChange={onValueChange}
                    defaultValue="COD"
                    className="grid gap-4"
                >
                    <div className="flex items-center space-y-0 space-x-3 rounded-xl border p-4 transition-colors hover:bg-slate-50">
                        <RadioGroupItem value="COD" id="cod" />
                        <Label
                            htmlFor="cod"
                            className="flex flex-1 cursor-pointer items-center gap-3 font-normal"
                        >
                            <Banknote className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="font-bold text-gray-900">
                                    Thanh toán khi nhận hàng (COD)
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    Thanh toán bằng tiền mặt khi nhận hàng
                                </p>
                            </div>
                        </Label>
                    </div>

                    {/* Thanh toán qua Ví điện tử / VNPAY */}
                    <div className="flex items-center space-y-0 space-x-3 rounded-xl border p-4 transition-colors hover:bg-slate-50">
                        <RadioGroupItem value="VNPAY" id="vnpay" />
                        <Label
                            htmlFor="vnpay"
                            className="flex flex-1 cursor-pointer items-center gap-3 font-normal"
                        >
                            <Wallet className="h-5 w-5 text-blue-500" />
                            <div>
                                <p className="font-bold text-gray-900">
                                    Thanh toán qua VNPAY
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    Hỗ trợ thẻ ATM, QR Code, Thẻ quốc tế
                                </p>
                            </div>
                        </Label>
                    </div>
                </RadioGroup>
            </CardContent>
        </Card>
    );
}
