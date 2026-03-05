"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Coins, Loader2, Ticket, Truck } from "lucide-react";

interface CheckoutSummary {
    totalAmount: number; // Tổng tiền gốc
    totalDiscount: number; // Giảm giá trực tiếp từ sản phẩm (nếu có)
    finalAmount: number; // Tiền sau khi trừ giảm giá sản phẩm (Tạm tính)
    totalItems: number;
}

interface CheckoutSummaryProps {
    summary: CheckoutSummary;
    hasAddresses: boolean;
    isProcessing: boolean;
    voucherDiscount?: number; // Giảm giá từ Voucher
    pointsDiscount?: number; // Giảm giá từ Điểm tích lũy
    shippingFee?: number; // Phí vận chuyển
    onConfirmOrder: () => void;
    onBackToCart: () => void;
}

export function CheckoutSummaryCard({
    summary,
    hasAddresses,
    isProcessing,
    voucherDiscount = 0,
    pointsDiscount = 0,
    shippingFee = 0,
    onConfirmOrder,
    onBackToCart,
}: CheckoutSummaryProps) {
    // Tính toán tổng tiền cuối cùng người dùng phải trả
    const displayFinalAmount = Math.max(
        0,
        summary.finalAmount + shippingFee - voucherDiscount - pointsDiscount
    );

    return (
        <Card className="sticky top-4 border-none bg-white shadow-sm">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-slate-800">
                    Tóm tắt đơn hàng
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    {/* Tạm tính */}
                    <div className="flex justify-between text-sm text-slate-600">
                        <span>Tạm tính ({summary.totalItems} sản phẩm)</span>
                        <span className="font-medium text-slate-800">
                            {summary.finalAmount.toLocaleString("vi-VN")}đ
                        </span>
                    </div>

                    {/* Phí vận chuyển */}
                    <div className="flex justify-between text-sm text-slate-600">
                        <span className="flex items-center gap-1.5">
                            <Truck className="h-4 w-4 text-slate-400" />
                            Phí vận chuyển
                        </span>
                        <span className="font-medium text-slate-800">
                            {shippingFee > 0
                                ? `+${shippingFee.toLocaleString("vi-VN")}đ`
                                : "Miễn phí"}
                        </span>
                    </div>

                    {/* Giảm giá Voucher */}
                    {voucherDiscount > 0 && (
                        <div className="flex justify-between text-sm text-emerald-600">
                            <span className="flex items-center gap-1.5">
                                <Ticket className="h-4 w-4" />
                                Voucher giảm giá
                            </span>
                            <span className="font-semibold">
                                -{voucherDiscount.toLocaleString("vi-VN")}đ
                            </span>
                        </div>
                    )}

                    {/* Giảm giá Điểm thưởng */}
                    {pointsDiscount > 0 && (
                        <div className="flex justify-between text-sm text-amber-600">
                            <span className="flex items-center gap-1.5">
                                <Coins className="h-4 w-4" />
                                Dùng điểm thưởng
                            </span>
                            <span className="font-semibold">
                                -{pointsDiscount.toLocaleString("vi-VN")}đ
                            </span>
                        </div>
                    )}

                    <Separator className="my-2" />

                    {/* Tổng cộng */}
                    <div className="flex items-end justify-between">
                        <span className="text-base font-bold text-slate-800">
                            Tổng cộng
                        </span>
                        <div className="text-right">
                            <span className="text-primary text-2xl font-bold">
                                {displayFinalAmount.toLocaleString("vi-VN")}đ
                            </span>
                            <p className="text-muted-foreground mt-1 text-[11px]">
                                (Đã bao gồm VAT nếu có)
                            </p>
                        </div>
                    </div>
                </div>

                <Button
                    className="mt-2 h-12 w-full rounded-xl text-base font-bold"
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
                    <p className="text-destructive text-center text-xs font-medium">
                        Vui lòng thêm địa chỉ giao hàng để tiếp tục
                    </p>
                )}

                <Button
                    variant="ghost"
                    className="w-full text-slate-500 hover:text-slate-800"
                    onClick={onBackToCart}
                    disabled={isProcessing}
                >
                    Quay lại giỏ hàng
                </Button>

                <div className="rounded-lg border border-blue-100/50 bg-blue-50/50 p-3">
                    <p className="text-[11px] leading-relaxed text-blue-800">
                        💡 Bằng việc đặt hàng, bạn đồng ý với{" "}
                        <a
                            href="#"
                            className="font-semibold underline hover:text-blue-900"
                        >
                            Điều khoản sử dụng
                        </a>{" "}
                        của chúng tôi
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
