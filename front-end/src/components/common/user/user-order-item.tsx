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

    return (
        <div
            onClick={() => router.push(`/user/orders/${id}`)}
            className="group relative mb-4 flex cursor-pointer flex-col gap-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md md:flex-row md:items-center"
        >
            {/* Hình ảnh sản phẩm */}
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-50 p-1 ring-1 ring-slate-100">
                <Image
                    src={image}
                    alt="Product"
                    fill
                    className="object-contain p-2 transition-transform group-hover:scale-105"
                />
            </div>

            {/* Thông tin chính */}
            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                    <Badge
                        variant="outline"
                        className="border-slate-200 bg-slate-50 text-[10px] font-semibold tracking-wider text-slate-500 uppercase"
                    >
                        <Hash className="mr-1 size-3" /> {id}
                    </Badge>
                    {getStatusBadge(status)}
                </div>

                <h3 className="line-clamp-2 text-base font-semibold text-slate-800 transition-colors group-hover:text-blue-600 md:line-clamp-1">
                    {title}
                </h3>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                        <CreditCard className="size-3.5" />
                        <span>Thanh toán:</span>
                        <span className="font-bold text-emerald-600">
                            {price}
                        </span>
                    </div>
                </div>
            </div>

            {/* Cột hành động & Điều hướng */}
            <div className="flex flex-col items-start gap-4 border-t border-slate-50 pt-4 md:items-end md:border-none md:pt-0">
                <div className="hidden items-center gap-1 text-gray-700 md:flex">
                    <span className="text-[11px] font-medium tracking-wide uppercase">
                        Chi tiết
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
                                    className="h-9 w-full rounded-lg border border-rose-100 bg-rose-50 px-4 text-xs font-semibold text-rose-600 transition-all hover:bg-rose-600 hover:text-white"
                                    disabled={isCancelling}
                                >
                                    Hủy đơn
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent
                                onClick={(e) => e.stopPropagation()}
                                className="rounded-2xl"
                            >
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-xl font-semibold text-slate-900">
                                        Xác nhận hủy đơn hàng?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-sm text-slate-500">
                                        Hành động này không thể hoàn tác. Số
                                        tiền (nếu đã thanh toán) sẽ được xử lý
                                        theo chính sách hoàn tiền.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="mt-4 gap-2">
                                    <AlertDialogCancel className="rounded-xl border-none bg-slate-100 font-medium">
                                        Bỏ qua
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => handleCancelOrder(id)}
                                        className="rounded-xl bg-rose-600 font-medium text-white hover:bg-rose-700"
                                    >
                                        Xác nhận hủy
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )}
            </div>
        </div>
    );
}
