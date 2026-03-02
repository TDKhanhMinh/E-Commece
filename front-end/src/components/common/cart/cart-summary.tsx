"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Loader2 } from "lucide-react";

interface CartSummaryProps {
    totalAmount: number;
    totalDiscount: number;
    finalAmount: number;
    totalItems: number;
    onCheckout?: () => void;
    isCheckingOut?: boolean;
    hasSelectedItems?: boolean;
}

export function CartSummary({
    totalAmount,
    totalDiscount,
    finalAmount,
    totalItems,
    onCheckout,
    isCheckingOut = false,
    hasSelectedItems = false,
}: CartSummaryProps) {
    return (
        <div className="lg:col-span-1">
            <Card className="sticky top-4 border-none bg-white shadow-md">
                <CardContent className="p-6">
                    <h2 className="mb-4 text-xl font-bold">Tóm tắt đơn hàng</h2>
                    <div className="space-y-3">
                        <div className="text-muted-foreground flex justify-between">
                            <span>Tạm tính</span>
                            <span>{totalAmount.toLocaleString("vi-VN")}đ</span>
                        </div>
                        {totalDiscount > 0 && (
                            <div className="text-destructive flex justify-between">
                                <span>Giảm giá</span>
                                <span>
                                    -{totalDiscount.toLocaleString("vi-VN")}đ
                                </span>
                            </div>
                        )}
                        <Separator className="my-4" />
                        <div className="flex items-baseline justify-between">
                            <span className="text-lg font-bold">Tổng cộng</span>
                            <p className="text-primary text-2xl font-black">
                                {finalAmount.toLocaleString("vi-VN")}đ
                            </p>
                        </div>
                        <div className="text-muted-foreground text-xs">
                            Tổng số lượng: {totalItems} sản phẩm
                        </div>
                        <Button
                            disabled={
                                totalItems === 0 ||
                                !hasSelectedItems ||
                                isCheckingOut
                            }
                            className="group mt-6 h-12 w-full text-lg font-semibold"
                            onClick={onCheckout}
                        >
                            {isCheckingOut ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    Thanh toán ngay
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </Button>
                        {!hasSelectedItems && totalItems > 0 && (
                            <p className="text-muted-foreground mt-2 text-center text-xs">
                                Vui lòng chọn sản phẩm để thanh toán
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
