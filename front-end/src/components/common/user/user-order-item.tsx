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

interface UserOrderItemProps {
    id: string;
    title: string;
    price: string;
    image: string;
    status?: string;
    isCancelling: boolean;
    handleCancelOrder: (orderId: string) => void;
}

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
            className="group flex cursor-pointer flex-col items-start gap-4 border-b py-6 transition-colors last:border-none hover:bg-gray-50/50 md:flex-row md:items-center"
        >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-white">
                <Image
                    src={image}
                    alt="Product"
                    fill
                    className="object-contain p-1"
                />
            </div>

            <div className="min-w-0 flex-1 pr-4">
                <h3 className="line-clamp-2 text-sm font-medium text-gray-900 md:line-clamp-1">
                    {title}
                </h3>
                {getStatusBadge(status)}
            </div>

            <div className="flex min-w-70 flex-col items-start gap-1 text-sm md:items-end">
                <div className="flex gap-1">
                    <span className="font-bold text-gray-900">Thanh toán:</span>
                    <span className="font-semibold text-green-600">
                        {price}
                    </span>
                </div>
                <div className="flex gap-1 text-gray-600">
                    <span className="font-bold text-gray-900">
                        Mã đơn hàng:
                    </span>
                    <span>#{id}</span>
                </div>
                {status === "PENDING" && (
                    <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive border-destructive hover:bg-destructive/10"
                                    disabled={isCancelling}
                                >
                                    Hủy đơn hàng
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent
                                onClick={(e) => e.stopPropagation()}
                            >
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Xác nhận hủy đơn hàng?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Hành động này không thể hoàn tác. Số
                                        tiền (nếu đã thanh toán) sẽ được xử lý
                                        theo chính sách hoàn tiền.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Bỏ qua
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => handleCancelOrder(id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
