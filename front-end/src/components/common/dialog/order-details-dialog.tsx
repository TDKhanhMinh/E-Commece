"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, MapPin, ShoppingBag } from "lucide-react";
import { useOrderDetail } from "@/hooks/use-order";
import { fDateTime } from "@/lib/format-date-time";
import { formatCurrency } from "@/lib/format-price";
import { OrderDetailResponse, OrderItem } from "@/type/order-type";
import Image from "next/image";
import { getStatusBadge } from "@/lib/get-order-status";
import { useTranslations } from "next-intl";

interface OrderDetailsDialogProps {
    orderId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function OrderDetailsDialog({
    orderId,
    open,
    onOpenChange,
}: OrderDetailsDialogProps) {
    const t = useTranslations("orders");
    const tStatus = useTranslations("user.orders.statuses");
    const { data, isLoading } = useOrderDetail(orderId || "");
    const orderDetails = data as OrderDetailResponse | undefined;
    const products: OrderItem[] = orderDetails?.items || [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] w-full max-w-lg overflow-y-auto border-none bg-slate-50 p-0 shadow-xl dark:bg-slate-950">
                <DialogHeader className="sticky top-0 z-10 bg-slate-50 p-6 pb-0 dark:bg-slate-950">
                    <DialogTitle className="text-2xl font-bold dark:text-slate-100">
                        {t("details.title", { id: orderId ?? "" })}
                    </DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    <div className="flex flex-col gap-6 p-6">
                        <Card className="border-none shadow-sm dark:bg-slate-900 dark:border dark:border-slate-800">
                            <CardHeader className="">
                                <div className="flex items-start gap-2 text-sm">
                                    <MapPin className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                                    <div>
                                        <span className="text-secondary-dark text-lg font-semibold dark:text-slate-100">
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
                                        <p className="text-muted-foreground mt-1 leading-relaxed">
                                            {t("details.locationLabel")}:{" "}
                                            {
                                                orderDetails?.deliveryAddress
                                                    ?.location
                                            }
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        {t("details.statusLabel")}:
                                    </span>
                                    <span className="font-bold text-red-500 uppercase">
                                        {getStatusBadge(orderDetails?.status, tStatus)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        {t("details.paymentMethodLabel")}:
                                    </span>
                                    <span className="font-bold text-red-500 uppercase">
                                        {orderDetails?.paymentMethod}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        {t("details.shippingMethodLabel")}:
                                    </span>
                                    <span className="font-bold text-red-500 uppercase">
                                        {orderDetails?.shippingMethod}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        {t("details.orderTimeLabel")}:
                                    </span>
                                    <span className="font-medium">
                                        {fDateTime(
                                            orderDetails?.createdAt,
                                            "HH:mm dd/MM/yyyy"
                                        )}
                                    </span>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            {t("details.itemsTotal")}
                                        </span>
                                        <span className="font-medium">
                                            {formatCurrency(
                                                orderDetails?.totalAmount || 0
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-green-600">
                                        <span>{t("details.discount")}</span>
                                        <span>
                                            -
                                            {formatCurrency(
                                                orderDetails?.totalDiscount || 0
                                            )}
                                        </span>
                                    </div>
                                    <Separator className="my-1" />
                                    <div className="flex items-center justify-between pt-1">
                                        <span className="text-base font-bold dark:text-slate-100">
                                            {t("details.totalAmount")}
                                        </span>
                                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                            {formatCurrency(
                                                orderDetails?.finalAmount || 0
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 px-1">
                                <ShoppingBag className="text-secondary-dark size-4 dark:text-slate-200" />
                                <h3 className="text-md text-secondary-dark font-bold dark:text-slate-200">
                                    {t("details.productsCount", { count: products.length })}
                                </h3>
                            </div>

                            <div className="flex flex-col gap-3">
                                {products.map((product, index) => (
                                    <div
                                        key={product.skuCode || index}
                                        className="flex gap-4 rounded-xl border bg-white p-3 shadow-sm dark:bg-slate-900 dark:border-slate-800"
                                    >
                                        <div className="relative h-16 w-16 shrink-0 rounded-lg border bg-slate-50 p-1 dark:bg-slate-800 dark:border-slate-700">
                                            <Image
                                                src={
                                                    product.image ||
                                                    "/placeholder.png"
                                                }
                                                alt="product"
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                                            <div>
                                                <h4 className="text-secondary-dark line-clamp-1 text-sm font-semibold dark:text-slate-200">
                                                    {product.productName}
                                                </h4>
                                                <p className="text-muted-foreground text-[11px]">
                                                    {t("details.skuLabel")}: {product.skuCode}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-red-500">
                                                        {formatCurrency(
                                                            product.salePrice
                                                        )}
                                                    </span>
                                                    {product.price >
                                                        product.salePrice && (
                                                        <span className="text-muted-foreground text-[10px] line-through">
                                                            {formatCurrency(
                                                                product.price
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold dark:bg-slate-800 dark:text-slate-300">
                                                    {t("details.quantityLabel", { count: product.quantity })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
