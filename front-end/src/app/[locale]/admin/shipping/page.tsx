"use client";

import React, { useState } from "react";
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
import { Loader2, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
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

const ITEMS_PER_PAGE = 10;

export default function DeliveryManagementPage() {
    const [currentPage, setCurrentPage] = useState(0);
    const { data: delivery, isLoading, error } = useDelivery(undefined, currentPage, ITEMS_PER_PAGE);
    //@ts-expect-error API response structure
    const deliveryData = delivery?.content || [];
    //@ts-expect-error API response structure
    const totalPages = delivery?.totalPages || 0;
    //@ts-expect-error API response structure
    const totalElements = delivery?.totalElements || 0;
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
                        {deliveryData.map((deli: AdminDeliveryResponseDTO) => (
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
                                    className="max-w-62.5 truncate"
                                    title={deli.destination}
                                >
                                    {deli.destination}
                                </TableCell>

                                <TableCell>
                                    {deli.shipperName ? (
                                        <span className="font-medium text-slate-700">
                                            {deli.shipperName}
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

            {/* Pagination */}
            {totalElements > 0 && (
                <div className="flex items-center justify-between rounded-md border bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                            Trang {currentPage + 1} / {totalPages}
                        </span>
                        <span className="text-sm text-gray-500">
                            (Tổng cộng {totalElements} bản ghi)
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                            disabled={currentPage === 0}
                            className="flex items-center gap-2"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Trước
                        </Button>
                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i).map(
                                (page) => (
                                    <Button
                                        key={page}
                                        variant={
                                            currentPage === page
                                                ? "default"
                                                : "outline"
                                        }
                                        size="sm"
                                        onClick={() => setCurrentPage(page)}
                                        className="min-w-10"
                                    >
                                        {page + 1}
                                    </Button>
                                )
                            )}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                            disabled={currentPage === totalPages - 1}
                            className="flex items-center gap-2"
                        >
                            Tiếp
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
