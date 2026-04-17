"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Loader2, MapPin, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useOrderDetail } from "@/hooks/use-order";
import { fDateTime } from "@/lib/format-date-time";
import { formatCurrency } from "@/lib/format-price";
import { toast } from "sonner";

import { OrderDetailResponse, OrderItem } from "@/type/order-type";
import Image from "next/image";
import { getStatusBadge } from "@/lib/get-order-status";
import { useEffect } from "react";
import { BackButton } from "@/components/common/ui/back-button";

export default function OrderDetail() {
    const params = useParams();
    const searchParams = useSearchParams();
    const orderId = params?.id as string;

    const responseCode = searchParams.get("vnp_ResponseCode");

    const { data, isLoading } = useOrderDetail(orderId);
    const orderDetails = data as OrderDetailResponse | undefined;

    const products: OrderItem[] = orderDetails?.items || [];
    const getShippingMethodLabel = (method?: string) => {
        if (!method) return "Chưa xác định";

        switch (method.toLowerCase()) {
            case "standard":
                return "Giao hàng tiêu chuẩn";
            case "express":
                return "Giao hàng hỏa tốc";
            default:
                return method;
        }
    };
    console.log("Order detail data:", orderDetails);
    useEffect(() => {
        // @ts-ignore

        if (responseCode) {
            if (responseCode === "00") {
                toast.success("Thanh toán đơn hàng thành công!");
            } else {
                toast.error("Thanh toán thất bại hoặc đã bị hủy.");
            }

            window.history.replaceState(
                {},
                document.title,
                window.location.pathname
            );
        }
    }, [searchParams]);
    if (isLoading) {
        return (
            <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center p-4 dark:bg-slate-950">
                <div className="text-muted-foreground flex flex-col items-center gap-2 dark:text-slate-400">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p>Đang tải thông tin đơn hàng...</p>
                </div>
            </div>
        );
    }

    if ((!orderDetails || !products.length) && orderId) {
        return (
            <div className="mx-auto min-h-screen max-w-7xl p-4 md:p-6 dark:bg-slate-950">
                <div className="mt-4 rounded-lg border bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-secondary-dark text-lg font-medium dark:text-slate-100">
                        Không tìm thấy đơn hàng với ID: {orderId}
                    </p>
                    <BackButton />
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto min-h-screen max-w-7xl p-4 md:p-6 dark:bg-slate-950">
            <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* CỘT TRÁI: THÔNG TIN ĐƠN HÀNG */}
                <Card className="border-none shadow-sm lg:col-span-2 dark:bg-slate-900 dark:shadow-slate-950/50">
                    <CardHeader className="pb-4">
                        <div className="mb-4 flex items-center gap-2">
                            <Link
                                href="/user/orders"
                                className="text-secondary-dark hover:text-info cursor-pointer transition-colors dark:text-slate-400 dark:hover:text-green-400"
                            >
                                <ChevronLeft className="size-5" />
                            </Link>
                            <CardTitle className="text-xl font-bold dark:text-slate-100">
                                Chi tiết đơn hàng
                            </CardTitle>
                        </div>

                        <div className="space-y-1">
                            <p className="text-secondary-dark text-lg font-bold dark:text-slate-100">
                                Mã đơn hàng: {orderDetails?.orderId || "N/A"}
                            </p>
                            <div className="text-secondary-dark mt-2 flex items-start gap-2 text-sm dark:text-slate-400">
                                <MapPin className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                                <div>
                                    <span className="font-semibold">
                                        {
                                            orderDetails?.deliveryAddress
                                                ?.userName
                                        }{" "}
                                        -{" "}
                                        {
                                            orderDetails?.deliveryAddress
                                                ?.phoneNumber
                                        }
                                    </span>
                                    <p className="text-secondary-dark mt-1 leading-relaxed dark:text-slate-400">
                                        Địa chỉ:{" "}
                                        {
                                            orderDetails?.deliveryAddress
                                                ?.location
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="space-y-4 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-secondary-dark font-semibold dark:text-slate-300">
                                    Trạng thái đơn hàng
                                </span>
                                <span className="font-medium text-red-500 dark:text-red-400">
                                    {getStatusBadge(orderDetails?.status)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-secondary-dark font-semibold dark:text-slate-300">
                                    Phương thức thanh toán
                                </span>
                                <span className="text-secondary-dark dark:text-slate-400">
                                    {orderDetails?.paymentMethod}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-secondary-dark font-semibold dark:text-slate-300">
                                    Phương thức vận chuyển
                                </span>
                                <span className="text-secondary-dark dark:text-slate-400">
                                    {getShippingMethodLabel(
                                        orderDetails?.shippingMethod
                                    )}
                                </span>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2 text-sm">
                            <div className="text-secondary-dark flex justify-between dark:text-slate-400">
                                <span>Tổng tiền sản phẩm</span>
                                <span className="text-secondary-dark dark:text-slate-200">
                                    {formatCurrency(
                                        orderDetails?.totalAmount || 0
                                    )}
                                </span>
                            </div>
                            <div className="text-secondary-dark flex justify-between dark:text-slate-400">
                                <span>Ưu đãi thành viên (đã giảm)</span>
                                <span className="text-secondary-dark dark:text-slate-200">
                                    {formatCurrency(
                                        orderDetails?.pointDiscount
                                    )}
                                </span>
                            </div>
                            <div className="text-secondary-dark flex justify-between dark:text-slate-400">
                                <span>Ưu đãi sản phẩm (đã giảm)</span>
                                <span className="text-secondary-dark dark:text-slate-200">
                                    {formatCurrency(
                                        orderDetails?.productDiscount
                                    )}
                                </span>
                            </div>
                            <div className="text-secondary-dark flex justify-between dark:text-slate-400">
                                <span>Giảm giá voucher</span>
                                <span className="text-secondary-dark dark:text-slate-200">
                                    {formatCurrency(
                                        orderDetails?.voucherDiscount
                                    )}
                                </span>
                            </div>
                            <div className="text-secondary-dark flex justify-between dark:text-slate-400">
                                <span>Phí vận chuyển</span>
                                {orderDetails?.shippingCost === 0 ? (
                                    <span className="text-secondary-dark text-xs dark:text-green-400">
                                        Miễn phí
                                    </span>
                                ) : (
                                    <span className="text-secondary-dark dark:text-slate-200">
                                        {formatCurrency(
                                            orderDetails?.shippingCost
                                        )}
                                    </span>
                                )}
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-secondary-dark text-base font-light dark:text-slate-400">
                                    Tổng tiền giảm giá
                                </span>
                                <span className="text-secondary-dark text-base font-light dark:text-slate-200">
                                    {formatCurrency(
                                        orderDetails?.totalDiscount || 0
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-secondary-dark text-base font-bold dark:text-slate-100">
                                    Tổng tiền thanh toán
                                </span>
                                <span className="text-secondary-dark text-xl font-bold dark:text-green-500">
                                    {formatCurrency(
                                        orderDetails?.finalAmount || 0
                                    )}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-secondary-dark text-xs font-light dark:text-slate-500">
                                    Thời gian đặt hàng
                                </span>
                                <span className="text-secondary-dark text-xs font-light dark:text-slate-500">
                                    {fDateTime(
                                        orderDetails?.createdAt,
                                        "HH:mm dd/MM/yyyy"
                                    )}
                                </span>
                            </div>
                            {orderDetails?.cancelledAt && (
                                <div className="flex items-center justify-between">
                                    <span className="text-secondary-dark text-xs font-light dark:text-slate-500">
                                        Thời gian hủy đơn
                                    </span>
                                    <span className="text-secondary-dark text-xs font-light dark:text-slate-500">
                                        {fDateTime(
                                            orderDetails?.cancelledAt,
                                            "HH:mm dd/MM/yyyy"
                                        )}
                                    </span>
                                </div>
                            )}
                            {orderDetails?.confirmedAt && (
                                <div className="flex items-center justify-between">
                                    <span className="text-secondary-dark text-xs font-light dark:text-slate-500">
                                        Thời gian xác nhận đơn
                                    </span>
                                    <span className="text-secondary-dark text-xs font-light dark:text-slate-500">
                                        {fDateTime(
                                            orderDetails?.confirmedAt,
                                            "HH:mm dd/MM/yyyy"
                                        )}
                                    </span>
                                </div>
                            )}
                            {orderDetails?.deliveredAt && (
                                <div className="flex items-center justify-between">
                                    <span className="text-secondary-dark text-xs font-light dark:text-slate-500">
                                        Thời gian giao hàng
                                    </span>
                                    <span className="text-secondary-dark text-xs font-light dark:text-slate-500">
                                        {fDateTime(
                                            orderDetails?.updatedAt,
                                            "HH:mm dd/MM/yyyy"
                                        )}
                                    </span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* CỘT PHẢI: DANH SÁCH SẢN PHẨM */}
                <Card className="h-fit border-none shadow-sm dark:bg-slate-900 dark:shadow-slate-950/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg font-bold dark:text-slate-100">
                            <ShoppingBag className="size-5" />
                            Danh sách sản phẩm
                        </CardTitle>
                        <p className="text-secondary-dark text-sm dark:text-slate-400">
                            {products.length} món
                        </p>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-4">
                        {products.map((product: OrderItem, index: number) => (
                            <div
                                key={product.skuCode || index}
                                className="flex gap-4 rounded-xl border bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50"
                            >
                                <div className="relative h-20 w-20 shrink-0">
                                    <Image
                                        src={product.image}
                                        alt="Product"
                                        fill
                                        className="rounded-md object-contain"
                                    />
                                </div>

                                <div className="flex-1 space-y-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="text-secondary-dark line-clamp-2 text-sm font-medium dark:text-slate-100">
                                            {product.productName}
                                        </h4>

                                        <span className="shrink-0 rounded-md bg-green-700 px-2 py-1 text-xs font-bold text-white dark:bg-green-600">
                                            x{product.quantity}
                                        </span>
                                    </div>

                                    <p className="text-secondary-dark line-clamp-1 text-xs dark:text-slate-400">
                                        SKU: {product.skuCode}
                                    </p>

                                    <div className="flex items-center gap-2 pt-1">
                                        <span className="text-sm font-bold text-red-500 dark:text-red-400">
                                            {formatCurrency(product.salePrice)}
                                        </span>
                                        <span className="text-secondary-dark text-xs line-through decoration-gray-400 dark:text-slate-500 dark:decoration-slate-600">
                                            {formatCurrency(product.price)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
