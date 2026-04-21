"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { getStatusBadge } from "@/lib/get-order-status";
import { UserOrderItemProps } from "@/type/order-type";
import { ChevronRight, CreditCard, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { useTranslations } from "next-intl";

export function UserOrderItem({
    id,
    title,
    price,
    image,
    status,
    isCancelling,
    handleCancelOrder,
}: UserOrderItemProps) {
    const router = useRouter();
    const t = useTranslations("common.user.order");
    const tStatus = useTranslations("user.orders.statuses");

    return (
        <div
            onClick={() => router.push(`/user/orders/${id}`)}
            className="group relative mb-4 flex cursor-pointer flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/50 md:flex-row md:items-center md:gap-5 md:p-5"
        >
            {/* Hình ảnh sản phẩm & Thông tin chính */}
            <div className="flex gap-4 md:contents">
                {/* Hình ảnh sản phẩm */}
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-50 p-1 ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700 sm:h-20 sm:w-20">
                    <Image
                        src={image}
                        alt="Product"
                        fill
                        className="object-contain p-1.5 transition-transform group-hover:scale-105"
                    />
                </div>

                {/* Thông tin chính */}
                <div className="flex flex-1 flex-col justify-center space-y-1 md:space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge
                            variant="outline"
                            className="border-slate-200 bg-slate-50 text-[9px] sm:text-[10px] font-semibold tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400"
                        >
                            <Hash className="mr-1 size-3" /> {id}
                        </Badge>
                        {getStatusBadge(status, tStatus)}
                    </div>

                    <h3 className="line-clamp-2 text-sm sm:text-base font-semibold text-slate-800 transition-colors group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400 md:line-clamp-1">
                        {title}
                    </h3>

                    <div className="flex items-center gap-4 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                            <CreditCard className="size-3 sm:size-3.5" />
                            <span>{t("paymentLabel")}</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                {price}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cột hành động & Điều hướng */}
            <div className="flex flex-col items-start gap-3 border-t border-slate-50 pt-4 dark:border-slate-800 md:items-end md:border-none md:pt-0">
                <div className="hidden items-center gap-1 text-gray-700 dark:text-slate-400 md:flex">
                    <span className="text-[11px] font-medium tracking-wide uppercase">
                        {t("viewDetails")}
                    </span>
                    <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
                </div>

                {/* Nút hủy đơn (Chỉ hiện khi PENDING) */}
                {(status === "PENDING" || status === "UNPAID") && (
                    <div
                        className="w-full md:w-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-10 md:h-9 w-full rounded-lg border border-rose-100 bg-rose-50 px-4 text-xs font-semibold text-rose-600 transition-all hover:bg-rose-600 hover:text-white dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:text-white"
                                    disabled={isCancelling}
                                >
                                    {t("cancelBtn")}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent
                                onClick={(e) => e.stopPropagation()}
                                className="rounded-2xl dark:border-slate-800 dark:bg-slate-900 w-[calc(100vw-32px)] sm:w-full max-w-md"
                            >
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
                                        {t("cancelTitle")}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-sm text-slate-500 dark:text-slate-400">
                                        {t("cancelDesc")}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="mt-4 flex flex-col-reverse sm:flex-row gap-2">
                                    <AlertDialogCancel className="mt-0 h-11 sm:h-auto rounded-xl border-none bg-slate-100 font-medium dark:bg-slate-800 dark:text-slate-100">
                                        {t("ignore")}
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => handleCancelOrder(id)}
                                        className="h-11 sm:h-auto rounded-xl bg-rose-600 font-medium text-white hover:bg-rose-700"
                                    >
                                        {t("confirmCancel")}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )}
                
                {/* Mobile View Details hint */}
                <div className="flex w-full items-center justify-between pt-1 md:hidden">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-tight">
                        {t("viewDetails")}
                    </span>
                    <ChevronRight className="size-4 text-slate-400" />
                </div>
            </div>
        </div>
    );
}
