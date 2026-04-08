"use client";

import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AdminDeliveryResponseDTO } from "@/type/delivery-type";
import { formatCurrency } from "@/lib/format-price";
import { fDateTime } from "@/lib/format-date-time";
import { useDelivery } from "@/hooks/use-delivery";
import { Loader2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const getDeliveryStatusBadge = (
    status: AdminDeliveryResponseDTO["deliveryStatus"]
) => {
    switch (status) {
        case "PENDING":
            return (
                <Badge className="bg-yellow-500 hover:bg-yellow-600">
                    Chờ Tài Xế
                </Badge>
            );
        case "PICKED_UP":
            return (
                <Badge className="bg-blue-400 hover:bg-blue-500">
                    Đã Lấy Hàng
                </Badge>
            );
        case "DELIVERING":
            return (
                <Badge className="bg-blue-600 hover:bg-blue-700">
                    Đang Giao
                </Badge>
            );
        case "SUCCESS":
            return (
                <Badge className="bg-green-600 hover:bg-green-700">
                    Thành Công
                </Badge>
            );
        case "FAILED":
        case "CANCELLED":
            return <Badge variant="destructive">Thất Bại/Hủy</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

const getPaymentStatusBadge = (
    status: AdminDeliveryResponseDTO["paymentStatus"]
) => {
    if (status === "PAID") {
        return (
            <Badge
                variant="outline"
                className="border-green-600 bg-green-50 text-green-600"
            >
                Đã Thanh Toán
            </Badge>
        );
    }
    return (
        <Badge
            variant="outline"
            className="border-red-600 bg-red-50 text-red-600"
        >
            Thu COD
        </Badge>
    );
};

export default function DeliveryManagementPage() {
    const { data: delivery, isLoading, error } = useDelivery();
    //@ts-ignore
    const deliveryData = delivery?.content || [];
    console.log("Delivery data:", delivery);
    if (isLoading) {
        return (
            <div className="w-full rounded-xl border bg-white p-6 shadow-sm">
                <div className="flex min-h-100 items-center justify-center">
                    <Loader2 className="text-primary h-8 w-8 animate-spin" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full rounded-xl border bg-white p-6 shadow-sm">
                <div className="flex min-h-100 items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-600">
                            Không thể tải danh sách đơn vận. Xin lỗi vì sự bất
                            tiện này.
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                            Vui lòng thử lại sau
                        </p>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="mx-auto max-w-7xl space-y-6 p-6 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Quản lý Vận đơn
                    </h1>
                    <p className="text-muted-foreground">
                        Theo dõi và điều phối các đơn hàng đang giao.
                    </p>
                </div>
            </div>

            <div className="overflow-hidden rounded-md border bg-white shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="w-20">Mã VĐ</TableHead>
                            <TableHead className="w-20">Mã ĐH</TableHead>
                            <TableHead>Khách Hàng</TableHead>
                            <TableHead className="min-w-50">
                                Địa Chỉ Giao
                            </TableHead>
                            <TableHead>Shipper</TableHead>
                            <TableHead className="text-right">
                                Tiền Thu (COD)
                            </TableHead>
                            <TableHead className="text-center">
                                Thanh Toán
                            </TableHead>
                            <TableHead className="text-center">
                                Trạng Thái
                            </TableHead>
                            <TableHead className="text-right">
                                Ngày Tạo
                            </TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {deliveryData.map((deli: any) => (
                            <TableRow key={deli.deliveryId}>
                                <TableCell className="font-medium">
                                    #{deli.deliveryId}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    #{deli.orderId}
                                </TableCell>

                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-semibold">
                                            {deli.customerName}
                                        </span>
                                        <span className="text-muted-foreground text-xs">
                                            {deli.customerPhone}
                                        </span>
                                    </div>
                                </TableCell>

                                <TableCell
                                    className="max-w-[250px] truncate"
                                    title={deli.destination}
                                >
                                    {deli.destination}
                                </TableCell>

                                <TableCell>
                                    {deli.shipperProfile ? (
                                        <span className="font-medium text-slate-700">
                                            {deli.shipperProfile.fullName}
                                        </span>
                                    ) : (
                                        <span className="text-muted-foreground text-sm italic">
                                            Chưa có
                                        </span>
                                    )}
                                </TableCell>

                                <TableCell className="text-right font-bold text-slate-700">
                                    {formatCurrency(deli.codAmount)}
                                </TableCell>

                                <TableCell className="text-center">
                                    {getPaymentStatusBadge(deli.paymentStatus)}
                                </TableCell>

                                <TableCell className="text-center">
                                    {getDeliveryStatusBadge(
                                        deli.deliveryStatus
                                    )}
                                </TableCell>

                                <TableCell className="text-muted-foreground text-right text-sm">
                                    {fDateTime(
                                        deli.createdAt,
                                        "dd/MM/yyyy HH:mm"
                                    )}
                                </TableCell>
                                <TableCell className="text-muted-foreground text-right text-sm">
                                    <Button variant={"ghost"} size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}

                        {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            //@ts-expect-error
                            delivery?.totalElements === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={9}
                                        className="text-muted-foreground h-24 text-center"
                                    >
                                        Không có dữ liệu vận đơn nào.
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
