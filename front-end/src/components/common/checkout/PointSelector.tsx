"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Coins, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePoints } from "@/hooks/use-point";

interface PointSelectorProps {
    totalAmount: number;
    onPointsChange: (points: number, discountValue: number) => void;
}

export function PointSelector({
    totalAmount,
    onPointsChange,
}: PointSelectorProps) {
    const { useMyPointSummary } = usePoints();
    const { data: summary, isLoading } = useMyPointSummary();

    const [isUsed, setIsUsed] = useState(false);
    const [pointsInput, setPointsInput] = useState<number>(0);

    const POINT_EXCHANGE_RATE = 100;

    const maxPointsAvailable = summary?.currentPoints || 0;

    const maxPointsAllowedForOrder = Math.floor(
        (totalAmount * 0.5) / POINT_EXCHANGE_RATE
    );
    const actualMaxPoints = Math.min(
        maxPointsAvailable,
        maxPointsAllowedForOrder
    );

    const handleToggle = (checked: boolean) => {
        setIsUsed(checked);
        if (!checked) {
            setPointsInput(0);
            onPointsChange(0, 0);
        } else {
            setPointsInput(actualMaxPoints);
            onPointsChange(
                actualMaxPoints,
                actualMaxPoints * POINT_EXCHANGE_RATE
            );
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = parseInt(e.target.value) || 0;
        if (val > actualMaxPoints) val = actualMaxPoints;
        if (val < 0) val = 0;

        setPointsInput(val);
        onPointsChange(val, val * POINT_EXCHANGE_RATE);
    };

    if (isLoading || !summary) return null;

    return (
        <Card className="border-none bg-amber-50/30 shadow-sm">
            <CardContent className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-amber-100 p-2">
                            <Coins className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900">
                                    Dùng điểm thưởng
                                </span>
                                <Badge
                                    variant="secondary"
                                    className="border-none bg-amber-100 text-amber-700 transition-colors hover:bg-amber-200"
                                >
                                    {summary.membershipTier}
                                </Badge>
                            </div>
                            <p className="text-xs text-slate-500">
                                Bạn đang có:{" "}
                                <span className="font-bold text-amber-600">
                                    {summary.currentPoints
                                        ? summary.currentPoints
                                        : 0}
                                </span>{" "}
                                điểm
                            </p>
                        </div>
                    </div>
                    <Switch
                        checked={isUsed}
                        onCheckedChange={handleToggle}
                        disabled={actualMaxPoints === 0}
                    />
                </div>

                {isUsed && (
                    <div className="animate-in fade-in slide-in-from-top-1 mt-2 space-y-3 border-t border-amber-100 pt-3">
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <Label
                                    htmlFor="points"
                                    className="mb-1 block text-xs font-medium text-slate-600"
                                >
                                    Số điểm muốn dùng (Tối đa: {actualMaxPoints}
                                    )
                                </Label>
                                <Input
                                    id="points"
                                    type="number"
                                    value={pointsInput}
                                    onChange={handleInputChange}
                                    className="rounded-xl border-amber-200 bg-white focus-visible:ring-amber-500"
                                />
                            </div>
                            <div className="text-right">
                                <p className="mb-1 text-xs font-medium text-slate-600">
                                    Số tiền được giảm
                                </p>
                                <p className="text-lg font-bold text-amber-600">
                                    -
                                    {(
                                        pointsInput * POINT_EXCHANGE_RATE
                                    ).toLocaleString("vi-VN")}
                                    đ
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg bg-amber-100/50 p-2 text-[11px] font-medium text-amber-800">
                            <TrendingUp className="h-3.5 w-3.5" />
                            <span>
                                Tỉ lệ quy đổi: 1 điểm = {POINT_EXCHANGE_RATE}đ
                            </span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
