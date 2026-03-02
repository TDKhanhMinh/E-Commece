"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

interface CheckoutSummary {
    totalAmount: number;
    totalDiscount: number;
    finalAmount: number;
    totalItems: number;
}

interface CheckoutSummaryProps {
    summary: CheckoutSummary;
    hasAddresses: boolean;
    isProcessing: boolean;
    onConfirmOrder: () => void;
    onBackToCart: () => void;
}

export function CheckoutSummaryCard({
    summary,
    hasAddresses,
    isProcessing,
    onConfirmOrder,
    onBackToCart,
}: CheckoutSummaryProps) {
    return (
        <Card className="sticky top-4">
            <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tạm tính</span>
                        <span>
                            {summary.totalAmount.toLocaleString("vi-VN")}đ
                        </span>
                    </div>
                    {summary.totalDiscount > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-destructive">Giảm giá</span>
                            <span className="text-destructive">
                                -{summary.totalDiscount.toLocaleString("vi-VN")}
                                đ
                            </span>
                        </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                        <span>Tổng cộng</span>
                        <span className="text-primary">
                            {summary.finalAmount.toLocaleString("vi-VN")}đ
                        </span>
                    </div>
                    <p className="text-muted-foreground text-xs">
                        Tổng số lượng: {summary.totalItems} sản phẩm
                    </p>
                </div>

                <Button
                    className="w-full"
                    size="lg"
                    onClick={onConfirmOrder}
                    disabled={isProcessing || !hasAddresses}
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Đang xử lý...
                        </>
                    ) : (
                        "Xác nhận đặt hàng"
                    )}
                </Button>

                {!hasAddresses && (
                    <p className="text-muted-foreground text-center text-xs">
                        Vui lòng thêm địa chỉ giao hàng để tiếp tục
                    </p>
                )}

                <Button
                    variant="outline"
                    className="w-full"
                    onClick={onBackToCart}
                    disabled={isProcessing}
                >
                    Quay lại giỏ hàng
                </Button>

                <div className="rounded-lg bg-blue-50 p-3">
                    <p className="text-xs text-blue-900">
                        💡 Bằng việc đặt hàng, bạn đồng ý với{" "}
                        <a href="#" className="font-semibold underline">
                            Điều khoản sử dụng
                        </a>{" "}
                        của chúng tôi
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
