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
    Filter,
    Loader2,
    MoreHorizontal,
    RefreshCcw,
    Search,
    Trash2,
    X,
} from "lucide-react";
import { formatCurrency } from "@/lib/format-price";
import { fDateTime } from "@/lib/format-date-time";
import { useOrdersByAdmin } from "@/hooks/use-order";
import { OrderItemData } from "@/type/order-type";
import { OrderDetailsDialog } from "@/components/common/dialog/order-details-dialog";
import { UpdateStatusDialog } from "@/components/common/dialog/update-order-status-dialog";
import { getStatusBadge } from "@/lib/get-order-status";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function AdminOrderManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        status: "ALL",
        orderStartDate: "",
        orderEndDate: "",
        deliveryStartDate: "",
        deliveryEndDate: "",
    });
    const [tempFilters, setTempFilters] = useState(filters);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [statusUpdateData, setStatusUpdateData] = useState<{
        id: string;
        status: string;
    } | null>(null);
    const [isStatusOpen, setIsStatusOpen] = useState(false);

    // Debounce search input
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(0);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data, isLoading, isError } = useOrdersByAdmin({
        page,
        size,
        status: filters.status === "ALL" ? undefined : filters.status,
        startDate: filters.orderStartDate || null,
        endDate: filters.orderEndDate || null,
        deliveryStartDate: filters.deliveryStartDate || null,
        deliveryEndDate: filters.deliveryEndDate || null,
        query: debouncedSearch || null,
    });

    const activeFilterCount = Object.entries(filters).reduce((acc, [key, value]) => {
        if (key === "status") return value !== "ALL" ? acc + 1 : acc;
        return value ? acc + 1 : acc;
    }, 0);

    const handleApplyFilters = () => {
        setFilters(tempFilters);
        setPage(0);
        setIsFilterOpen(false);
    };

    const handleResetFilters = () => {
        const reset = {
            status: "ALL",
            orderStartDate: "",
            orderEndDate: "",
            deliveryStartDate: "",
            deliveryEndDate: "",
        };
        setTempFilters(reset);
        setFilters(reset);
        setPage(0);
        setIsFilterOpen(false);
    };

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
                        <div className="relative w-full sm:w-80">
                            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                            <Input
                                placeholder="Tìm kiếm mã ĐH, khách hàng..."
                                className="bg-slate-50/50 pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 text-gray-400 hover:text-gray-600"
                                    onClick={() => setSearchTerm("")}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="relative">
                                        <Filter className="mr-2 h-4 w-4" />
                                        Bộ lọc
                                        {activeFilterCount > 0 && (
                                            <Badge 
                                                variant="destructive" 
                                                className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]"
                                            >
                                                {activeFilterCount}
                                            </Badge>
                                        )}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
                                    <DialogHeader>
                                        <DialogTitle>Bộ lọc đơn hàng</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-6 py-4">
                                        <div className="space-y-3">
                                            <Label className="text-base font-semibold">Trạng thái đơn hàng</Label>
                                            <RadioGroup
                                                value={tempFilters.status}
                                                onValueChange={(value) => setTempFilters(prev => ({ ...prev, status: value }))}
                                                className="grid grid-cols-3 gap-2"
                                            >
                                                {[
                                                    { label: "Tất cả", value: "ALL" },
                                                    { label: "Chưa xác nhận", value: "PENDING" },
                                                    { label: "Đã xác nhận", value: "CONFIRMED" },
                                                    { label: "Đã thanh toán", value: "PAID" },
                                                    { label: "Chưa thanh toán", value: "UNPAID" },
                                                    { label: "Đang giao hàng", value: "SHIPPING" },
                                                    { label: "Đã giao hàng", value: "DELIVERED" },
                                                    { label: "Đã hủy", value: "CANCELLED" },
                                                    { label: "Thanh toán thất bại", value: "FAILED" },
                                                ].map((item) => (
                                                    <div key={item.value} className="flex items-center space-x-2 rounded-md border p-2 transition-colors hover:bg-slate-50">
                                                        <RadioGroupItem value={item.value} id={`status-${item.value}`} />
                                                        <Label htmlFor={`status-${item.value}`} className="flex-1 cursor-pointer text-sm font-normal">
                                                            {item.label}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            <Label className="text-base font-semibold">Khoảng thời gian đặt hàng</Label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="orderStartDate" className="text-xs text-muted-foreground">Từ ngày</Label>
                                                    <Input 
                                                        id="orderStartDate"
                                                        type="date" 
                                                        value={tempFilters.orderStartDate}
                                                        onChange={(e) => setTempFilters(prev => ({ ...prev, orderStartDate: e.target.value }))}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="orderEndDate" className="text-xs text-muted-foreground">Đến ngày</Label>
                                                    <Input 
                                                        id="orderEndDate"
                                                        type="date" 
                                                        value={tempFilters.orderEndDate}
                                                        onChange={(e) => setTempFilters(prev => ({ ...prev, orderEndDate: e.target.value }))}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            <Label className="text-base font-semibold">Khoảng thời gian giao hàng</Label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="deliveryStartDate" className="text-xs text-muted-foreground">Từ ngày</Label>
                                                    <Input 
                                                        id="deliveryStartDate"
                                                        type="date" 
                                                        value={tempFilters.deliveryStartDate}
                                                        onChange={(e) => setTempFilters(prev => ({ ...prev, deliveryStartDate: e.target.value }))}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="deliveryEndDate" className="text-xs text-muted-foreground">Đến ngày</Label>
                                                    <Input 
                                                        id="deliveryEndDate"
                                                        type="date" 
                                                        value={tempFilters.deliveryEndDate}
                                                        onChange={(e) => setTempFilters(prev => ({ ...prev, deliveryEndDate: e.target.value }))}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter className="flex sm:justify-between">
                                        <Button 
                                            variant="outline" 
                                            onClick={handleResetFilters}
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                                        >
                                            <RefreshCcw className="mr-2 h-4 w-4" />
                                            Đặt lại
                                        </Button>
                                        <Button onClick={handleApplyFilters}>
                                            Áp dụng bộ lọc
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
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
