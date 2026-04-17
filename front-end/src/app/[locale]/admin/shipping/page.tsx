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
import {
    ChevronLeft,
    ChevronRight,
    Filter,
    Loader2,
    MoreHorizontal,
    RefreshCcw,
    Search,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";

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
                className="border-green-600 dark:border-green-900/50 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400"
            >
                Đã Thanh Toán
            </Badge>
        );
    }
    return (
        <Badge
            variant="outline"
            className="border-red-600 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400"
        >
            Thu COD
        </Badge>
    );
};

const ITEMS_PER_PAGE = 10;

export default function DeliveryManagementPage() {
    const [currentPage, setCurrentPage] = useState(0);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        status: "ALL",
        startDate: "",
        endDate: "",
    });
    const [tempFilters, setTempFilters] = useState(filters);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Debounce search input
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(0);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const {
        data: delivery,
        isLoading,
        error,
    } = useDelivery({
        status: filters.status === "ALL" ? undefined : filters.status,
        startDate: filters.startDate || null,
        endDate: filters.endDate || null,
        query: debouncedSearch || null,
        page: currentPage,
        size: ITEMS_PER_PAGE,
    });

    const activeFilterCount = Object.entries(filters).reduce((acc, [key, value]) => {
        if (key === "status") return value !== "ALL" ? acc + 1 : acc;
        return value ? acc + 1 : acc;
    }, 0);

    const handleApplyFilters = () => {
        setFilters(tempFilters);
        setCurrentPage(0);
        setIsFilterOpen(false);
    };

    const handleResetFilters = () => {
        const reset = {
            status: "ALL",
            startDate: "",
            endDate: "",
        };
        setTempFilters(reset);
        setFilters(reset);
        setCurrentPage(0);
        setIsFilterOpen(false);
    };
    //@ts-expect-error API response structure
    const deliveryData = delivery?.content || [];
    //@ts-expect-error API response structure
    const totalPages = delivery?.totalPages || 0;
    //@ts-expect-error API response structure
    const totalElements = delivery?.totalElements || 0;
    console.log("Delivery data:", delivery);
    if (isLoading) {
        return (
            <div className="w-full rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                <div className="flex min-h-100 items-center justify-center">
                    <Loader2 className="text-primary h-8 w-8 animate-spin" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                <div className="flex min-h-100 items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-600 dark:text-red-400">
                            Không thể tải danh sách đơn vận. Xin lỗi vì sự bất
                            tiện này.
                        </p>
                        <p className="mt-2 text-sm text-gray-500 dark:text-slate-500">
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
                <div className="flex items-center gap-4">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                        <Input
                            placeholder="Tìm kiếm mã VĐ, khách hàng..."
                            className="bg-white dark:bg-slate-900 dark:border-slate-800 pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300"
                                onClick={() => setSearchQuery("")}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
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
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Bộ lọc vận đơn</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                            <div className="space-y-3">
                                <Label className="text-base font-semibold">Trạng thái vận đơn</Label>
                                <RadioGroup
                                    value={tempFilters.status}
                                    onValueChange={(value) => setTempFilters(prev => ({ ...prev, status: value }))}
                                    className="grid grid-cols-2 gap-2"
                                >
                                    {[
                                        { label: "Tất cả", value: "ALL" },
                                        { label: "Chờ lấy hàng", value: "PENDING" },
                                        { label: "Đã lấy hàng", value: "PICKED_UP" },
                                        { label: "Đang giao", value: "DELIVERING" },
                                        { label: "Thành công", value: "SUCCESS" },
                                        { label: "Đã hủy", value: "CANCELLED" },
                                    ].map((item) => (
                                        <div key={item.value} className="flex items-center space-x-2 rounded-md border dark:border-slate-800 p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
                                            <RadioGroupItem value={item.value} id={`status-${item.value}`} />
                                            <Label htmlFor={`status-${item.value}`} className="flex-1 cursor-pointer text-sm font-normal">
                                                {item.label}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Từ ngày</Label>
                                    <Input 
                                        id="startDate"
                                        type="date" 
                                        value={tempFilters.startDate}
                                        onChange={(e) => setTempFilters(prev => ({ ...prev, startDate: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">Đến ngày</Label>
                                    <Input 
                                        id="endDate"
                                        type="date" 
                                        value={tempFilters.endDate}
                                        onChange={(e) => setTempFilters(prev => ({ ...prev, endDate: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="flex sm:justify-between">
                            <Button 
                                variant="outline" 
                                onClick={handleResetFilters}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-900/50"
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

            <div className="overflow-hidden rounded-md border dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-900">
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
                                    {deli.shipperProfile ? (
                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                            {deli.shipperProfile.fullName}
                                        </span>
                                    ) : (
                                        <span className="text-muted-foreground text-sm italic">
                                            Chưa có
                                        </span>
                                    )}
                                </TableCell>

                                <TableCell className="text-right font-bold text-slate-700 dark:text-slate-300">
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
                <div className="flex items-center justify-between rounded-md border dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-slate-400">
                            Trang {currentPage + 1} / {totalPages}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-slate-500">
                            (Tổng cộng {totalElements} bản ghi)
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                setCurrentPage((prev) => Math.max(prev - 1, 0))
                            }
                            disabled={currentPage === 0}
                            className="flex items-center gap-2"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Trước
                        </Button>
                        <div className="flex gap-1">
                            {Array.from(
                                { length: totalPages },
                                (_, i) => i
                            ).map((page) => (
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
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(prev + 1, totalPages - 1)
                                )
                            }
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
