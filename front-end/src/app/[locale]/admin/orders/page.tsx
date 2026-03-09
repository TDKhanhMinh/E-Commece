"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Edit,
    Eye,
    Loader2,
    MoreHorizontal,
    Search,
    Trash2,
} from "lucide-react";
import { formatCurrency } from "@/lib/format-price";
import { fDateTime } from "@/lib/format-date-time";
import { useQuery } from "@tanstack/react-query";
import { getOrdersByUser } from "@/service/order-service";
import { OrderItemData } from "@/type/order-type";
import { OrderDetailsDialog } from "@/components/common/dialog/order-details-dialog";
import { UpdateStatusDialog } from "@/components/common/dialog/update-order-status-dialog";
import { getStatusBadge } from "@/lib/get-order-status";

export default function AdminOrderManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [statusUpdateData, setStatusUpdateData] = useState<{
        id: string;
        status: string;
    } | null>(null);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const { data, isLoading, isError } = useQuery({
        queryKey: ["admin-orders", statusFilter, page, size],
        queryFn: async () => {
            const params = {
                page,
                size,
                ...(statusFilter !== "ALL" && { status: statusFilter }),
            };
            // @ts-ignore
            const response = await getOrdersByUser(params);
            console.log("Admin orders data", response);
            return response;
        },
    });

    const orders: OrderItemData[] = data?.content || [];
    const totalElements = data?.numberOfElements || 0;
    const totalPages = data?.totalPages || 1;
    const handleViewDetails = (id: string) => {
        setSelectedOrderId(id);
        setIsDetailsOpen(true);
    };
    const handleOpenStatusUpdate = (id: string, currentStatus: string) => {
        setStatusUpdateData({ id, status: currentStatus });
        setIsStatusOpen(true);
    };
    return (
        <div className="mx-auto w-full space-y-6 p-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Quản lý đơn hàng
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Theo dõi và xử lý các đơn đặt hàng từ hệ thống.
                    </p>
                </div>
            </div>

            <Card className="border-none bg-white shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row">
                        <div className="relative w-full sm:w-72">
                            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                            <Input
                                placeholder="Tìm kiếm đơn hàng..."
                                className="bg-slate-50/50 pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Select
                                value={statusFilter}
                                onValueChange={(val) => {
                                    setStatusFilter(val);
                                    setPage(0);
                                }}
                            >
                                <SelectTrigger className="w-full bg-slate-50/50 sm:w-45">
                                    <SelectValue placeholder="Trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">
                                        Tất cả trạng thái
                                    </SelectItem>
                                    <SelectItem value="PENDING">
                                        Chưa xác nhận
                                    </SelectItem>
                                    <SelectItem value="CONFIRMED">
                                        Đã xác nhận
                                    </SelectItem>
                                    <SelectItem value="UNPAID">
                                        Chưa thanh toán
                                    </SelectItem>
                                    <SelectItem value="PAID">
                                        Đã thanh toán
                                    </SelectItem>
                                    <SelectItem value="SHIPPING">
                                        Đang giao hàng
                                    </SelectItem>
                                    <SelectItem value="DELIVERED">
                                        Đã giao hàng
                                    </SelectItem>
                                    <SelectItem value="CANCELLED">
                                        Đã hủy
                                    </SelectItem>
                                    <SelectItem value="FAILED">
                                        Thanh toán thất bại
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {isLoading ? (
                        <div className="text-muted-foreground flex flex-col items-center justify-center py-10">
                            <Loader2 className="mb-2 h-8 w-8 animate-spin" />
                            <p>Đang tải dữ liệu đơn hàng...</p>
                        </div>
                    ) : isError ? (
                        <div className="text-destructive py-10 text-center">
                            Đã xảy ra lỗi khi tải danh sách đơn hàng.
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-muted-foreground py-10 text-center">
                            Không tìm thấy đơn hàng nào.
                        </div>
                    ) : (
                        <>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow>
                                            <TableHead className="font-semibold">
                                                Mã ĐH
                                            </TableHead>
                                            <TableHead className="font-semibold">
                                                Khách hàng
                                            </TableHead>
                                            <TableHead className="font-semibold">
                                                Ngày đặt
                                            </TableHead>
                                            <TableHead className="font-semibold">
                                                Ngày giao
                                            </TableHead>
                                            <TableHead className="text-right font-semibold">
                                                Tổng tiền
                                            </TableHead>
                                            <TableHead className="text-center font-semibold">
                                                Trạng thái
                                            </TableHead>
                                            <TableHead className="text-right font-semibold">
                                                Thao tác
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orders.map((order) => (
                                            <TableRow
                                                key={order.id || order.orderId}
                                                className="transition-colors hover:bg-slate-50/50"
                                            >
                                                <TableCell className="font-medium">
                                                    {order.id || order.orderId}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium">
                                                            {order
                                                                .deliveryAddress
                                                                ?.userName ||
                                                                "Khách hàng ẩn danh"}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    {fDateTime(
                                                        order.createdAt,
                                                        "dd/MM/yyyy HH:mm"
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-left text-sm">
                                                    {order.deliveredAt
                                                        ? fDateTime(
                                                              order.deliveredAt,
                                                              "dd/MM/yyyy HH:mm"
                                                          )
                                                        : "Chưa giao"}
                                                </TableCell>
                                                <TableCell className="text-primary text-right font-semibold">
                                                    {formatCurrency(
                                                        order.finalAmount ||
                                                            order.totalAmount ||
                                                            0
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {getStatusBadge(
                                                        order.status
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <span className="sr-only">
                                                                    Mở menu
                                                                </span>
                                                                <MoreHorizontal className="text-muted-foreground h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end"
                                                            className="w-50"
                                                        >
                                                            <DropdownMenuLabel>
                                                                Hành động
                                                            </DropdownMenuLabel>
                                                            <DropdownMenuItem
                                                                className="cursor-pointer"
                                                                onClick={() =>
                                                                    handleViewDetails(
                                                                        (order.id ||
                                                                            order.orderId) as string
                                                                    )
                                                                }
                                                            >
                                                                <Eye className="mr-2 h-4 w-4 text-blue-500" />
                                                                Xem chi tiết
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="cursor-pointer"
                                                                onClick={() =>
                                                                    handleOpenStatusUpdate(
                                                                        (order.id ||
                                                                            order.orderId) as string,
                                                                        order.status
                                                                    )
                                                                }
                                                            >
                                                                <Edit className="mr-2 h-4 w-4 text-yellow-500" />
                                                                Cập nhật trạng
                                                                thái
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Xóa đơn hàng
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="flex items-center justify-between space-x-2 py-4">
                                <div className="text-muted-foreground text-sm">
                                    Trang <strong>{page + 1}</strong> /{" "}
                                    <strong>{totalPages}</strong> (Tổng{" "}
                                    {totalElements} đơn)
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={page === 0}
                                        onClick={() =>
                                            setPage((old) =>
                                                Math.max(0, old - 1)
                                            )
                                        }
                                    >
                                        Trước
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={page >= totalPages - 1}
                                        onClick={() =>
                                            setPage((old) => old + 1)
                                        }
                                    >
                                        Tiếp theo
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                    <OrderDetailsDialog
                        orderId={selectedOrderId}
                        open={isDetailsOpen}
                        onOpenChange={setIsDetailsOpen}
                    />
                    <UpdateStatusDialog
                        orderId={statusUpdateData?.id || null}
                        currentStatus={statusUpdateData?.status || "PENDING"}
                        open={isStatusOpen}
                        onOpenChange={setIsStatusOpen}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
