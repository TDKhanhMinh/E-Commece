// app/transactions/page.tsx
"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download, Eye, Filter, MoreHorizontal, Pencil, RefreshCcw, Trash2, X } from "lucide-react";
import { Input } from "@/components/ui/input";

import {
    RadioGroup,
    RadioGroupItem
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";

// Nhúng hook Admin vào trang
import { useTransactionsAdmin, useUpdateTransactionStatus } from "@/hooks/use-transaction";
import { TransactionResponse } from "@/type/transaction-type";
import { fDateTime } from "@/lib/format-date-time";
import { formatCurrency } from "@/lib/format-price";

const getStatusColor = (status: TransactionResponse["transactionStatus"]) => {
    switch (status) {
        case "SUCCESS":
            return "bg-green-100 text-green-800 hover:bg-green-100";
        case "PENDING":
            return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
        case "FAILED":
            return "bg-red-100 text-red-800 hover:bg-red-100";
        case "REJECTED":
            return "bg-slate-100 text-slate-800 hover:bg-slate-100";
        default:
            return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
};

const getActionLabel = (action: TransactionResponse["transactionAction"]) => {
    switch (action) {
        case "DELIVERY_FEE":
            return "Cước giao hàng";
        case "BONUS":
            return "Tiền thưởng";
        case "WITHDRAW_TO_BANK":
            return "Rút tiền về ngân hàng";
        case "PENALTY":
            return "Phạt vi phạm";
        case "COD_PAYMENT":
            return "Thu hộ (COD)";
        default:
            return action;
    }
};

// Component cho Transaction Actions Dropdown
const TransactionActions = ({
    transaction,
}: {
    transaction: TransactionResponse;
}) => {
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);

    const handleViewDetails = () => {
        console.log("View details for transaction:", transaction.transactionId);
    };

    const handleCopyId = () => {
        navigator.clipboard.writeText(transaction.transactionId.toString());
    };

    const handleExport = () => {
        console.log("Export transaction:", transaction.transactionId);
    };

    const handleDelete = () => {
        if (
            confirm(
                `Bạn chắc chắn muốn xóa giao dịch #${transaction.transactionId}?`
            )
        ) {
            console.log("Delete transaction:", transaction.transactionId);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Tính năng</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleViewDetails}>
                        <Eye className="mr-2 h-4 w-4 text-blue-500" />
                        <span>Xem chi tiết</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsUpdateOpen(true)}>
                        <Pencil className="mr-2 h-4 w-4 text-yellow-500" />
                        <span>Cập nhật trạng thái</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4 text-green-500" />
                        <span>Xuất file</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={handleDelete}
                        className="text-red-600 focus:text-red-600 cursor-pointer"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Xóa giao dịch</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <UpdateTransactionStatusDialog 
                transaction={transaction}
                open={isUpdateOpen}
                onOpenChange={setIsUpdateOpen}
            />
        </>
    );
};

// Component cập nhật trạng thái giao dịch
const UpdateTransactionStatusDialog = ({
    transaction,
    open,
    onOpenChange,
}: {
    transaction: TransactionResponse;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) => {
    const [selectedStatus, setSelectedStatus] = useState<string>(transaction.transactionStatus);
    const { mutate: updateStatus, isPending } = useUpdateTransactionStatus();

    const handleUpdate = () => {
        updateStatus(
            { transactionId: transaction.transactionId, status: selectedStatus },
            {
                onSuccess: () => {
                    onOpenChange(false);
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Cập nhật trạng thái giao dịch #{transaction.transactionId}</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <RadioGroup
                        value={selectedStatus}
                        onValueChange={setSelectedStatus}
                        className="grid grid-cols-2 gap-2"
                    >
                        {[
                            { label: "Đang chờ", value: "PENDING" },
                            { label: "Thành công", value: "SUCCESS" },
                            { label: "Thất bại", value: "FAILED" },
                            { label: "Bị từ chối", value: "REJECTED" },
                        ].map((item) => (
                            <div key={item.value} className="flex items-center space-x-2 rounded-md border p-3 hover:bg-slate-50 transition-colors cursor-pointer">
                                <RadioGroupItem value={item.value} id={`update-status-${item.value}`} />
                                <Label htmlFor={`update-status-${item.value}`} className="flex-1 cursor-pointer font-medium">
                                    {item.label}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                        Hủy
                    </Button>
                    <Button onClick={handleUpdate} disabled={isPending || selectedStatus === transaction.transactionStatus}>
                        {isPending ? <RefreshCcw className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Xác nhận cập nhật
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default function TransactionManagement() {
    const [page, setPage] = useState(0);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        status: "ALL",
        type: "ALL",
        action: "ALL",
        startDate: "",
        endDate: "",
    });
    const [tempFilters, setTempFilters] = useState(filters);
    const size = 20;

    const activeFilterCount = Object.entries(filters).reduce((acc, [key, value]) => {
        if (key === "status" || key === "type" || key === "action") {
            return value !== "ALL" ? acc + 1 : acc;
        }
        return value ? acc + 1 : acc;
    }, 0);

    const {
        data: pageData,
        isLoading,
        isError,
    } = useTransactionsAdmin({
        page,
        size,
        status: filters.status === "ALL" ? null : filters.status,
        type: filters.type === "ALL" ? null : filters.type,
        action: filters.action === "ALL" ? null : filters.action,
        startDate: filters.startDate || null,
        endDate: filters.endDate || null,
    });

    const handleApplyFilters = () => {
        setFilters(tempFilters);
        setPage(0);
        setIsFilterOpen(false);
    };

    const handleResetFilters = () => {
        const reset = {
            status: "ALL",
            type: "ALL",
            action: "ALL",
            startDate: "",
            endDate: "",
        };
        setTempFilters(reset);
        setFilters(reset);
        setPage(0);
        setIsFilterOpen(false);
    };
    //@ts-ignore
    // console.log("API Response in Component 1:", pageData.content);

    // 4. Xử lý chuyển trang
    const handlePageChange = (newPage: number) => {
        if (!pageData) return;
        //@ts-ignore
        if (newPage < 0 || newPage >= pageData.totalPages) return;
        setPage(newPage);
    };

    return (
        <div className="space-y-6 p-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl font-bold">
                        Quản Lý Giao Dịch (Admin)
                    </CardTitle>
                    <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="relative">
                                <Filter className="mr-2 h-4 w-4" />
                                Bộ lọc
                                {activeFilterCount > 0 && (
                                    <Badge 
                                        variant="destructive" 
                                        className="absolute -top-2 -right-2 h-5 w-5 justify-center rounded-full p-0 text-[10px]"
                                    >
                                        {activeFilterCount}
                                    </Badge>
                                )}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Bộ lọc giao dịch</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Trạng thái</Label>
                                    <RadioGroup
                                        value={tempFilters.status}
                                        onValueChange={(value) => setTempFilters(prev => ({ ...prev, status: value }))}
                                        className="grid grid-cols-2 gap-2 sm:grid-cols-3"
                                    >
                                        {[
                                            { label: "Tất cả", value: "ALL" },
                                            { label: "Đang chờ", value: "PENDING" },
                                            { label: "Thành công", value: "SUCCESS" },
                                            { label: "Thất bại", value: "FAILED" },
                                            { label: "Bị từ chối", value: "REJECTED" },
                                        ].map((item) => (
                                            <div key={item.value} className="flex items-center space-x-2 rounded-md border p-2 transition-colors hover:bg-slate-50">
                                                <RadioGroupItem value={item.value} id={`status-${item.value}`} />
                                                <Label htmlFor={`status-${item.value}`} className="flex-1 cursor-pointer text-sm">
                                                    {item.label}
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Loại giao dịch</Label>
                                    <RadioGroup
                                        value={tempFilters.type}
                                        onValueChange={(value) => setTempFilters(prev => ({ ...prev, type: value }))}
                                        className="grid grid-cols-2 gap-2 sm:grid-cols-3"
                                    >
                                        {[
                                            { label: "Tất cả", value: "ALL" },
                                            { label: "Cộng tiền", value: "CREDIT" },
                                            { label: "Trừ tiền", value: "DEBIT" },
                                        ].map((item) => (
                                            <div key={item.value} className="flex items-center space-x-2 rounded-md border p-2 transition-colors hover:bg-slate-50">
                                                <RadioGroupItem value={item.value} id={`type-${item.value}`} />
                                                <Label htmlFor={`type-${item.value}`} className="flex-1 cursor-pointer text-sm">
                                                    {item.label}
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Hành động</Label>
                                    <RadioGroup
                                        value={tempFilters.action}
                                        onValueChange={(value) => setTempFilters(prev => ({ ...prev, action: value }))}
                                        className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                                    >
                                        {[
                                            { label: "Tất cả", value: "ALL" },
                                            { label: "Cước giao hàng", value: "DELIVERY_FEE" },
                                            { label: "Tiền thưởng", value: "BONUS" },
                                            { label: "Rút về ngân hàng", value: "WITHDRAW_TO_BANK" },
                                            { label: "Phạt vi phạm", value: "PENALTY" },
                                            { label: "Thanh toán thu hộ", value: "COD_PAYMENT" },
                                        ].map((item) => (
                                            <div key={item.value} className="flex items-center space-x-2 rounded-md border p-2 transition-colors hover:bg-slate-50">
                                                <RadioGroupItem value={item.value} id={`action-${item.value}`} />
                                                <Label htmlFor={`action-${item.value}`} className="flex-1 cursor-pointer text-sm">
                                                    {item.label}
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Từ ngày</label>
                                        <Input 
                                            type="date" 
                                            value={tempFilters.startDate}
                                            onChange={(e) => setTempFilters(prev => ({ ...prev, startDate: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Đến ngày</label>
                                        <Input 
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
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
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
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="w-[100px]">
                                        Mã GD
                                    </TableHead>
                                    <TableHead>Thời Gian</TableHead>
                                    <TableHead>Loại Giao Dịch</TableHead>
                                    <TableHead>Số Tiền</TableHead>
                                    <TableHead>Trạng Thái</TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Mô Tả
                                    </TableHead>
                                    <TableHead className="w-[50px] text-right">
                                        Hành Động
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    // Hiển thị trạng thái đang tải
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="text-muted-foreground h-24 text-center"
                                        >
                                            Đang tải dữ liệu...
                                        </TableCell>
                                    </TableRow>
                                ) : isError ? (
                                    // Hiển thị trạng thái lỗi
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-24 text-center font-medium text-red-500"
                                        >
                                            Đã có lỗi xảy ra khi tải dữ liệu
                                            giao dịch.
                                        </TableCell>
                                    </TableRow>
                                ) : //@ts-ignore
                                pageData && pageData.content.length > 0 ? (
                                    //@ts-ignore
                                    pageData.content.map(
                                        (txn: TransactionResponse) => (
                                            <TableRow key={txn.transactionId}>
                                                <TableCell className="font-medium">
                                                    #{txn.transactionId}
                                                </TableCell>
                                                <TableCell>
                                                    {fDateTime(
                                                        txn.createdAt,
                                                        "dd/MM/yyyy HH:mm:ss"
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span
                                                            className={
                                                                txn.type ===
                                                                "CREDIT"
                                                                    ? "font-semibold text-green-600"
                                                                    : "font-semibold text-red-600"
                                                            }
                                                        >
                                                            {txn.type ===
                                                            "CREDIT"
                                                                ? "+ Cộng tiền"
                                                                : "- Trừ tiền"}
                                                        </span>
                                                        <span className="text-muted-foreground text-xs">
                                                            {getActionLabel(
                                                                txn.transactionAction
                                                            )}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-bold">
                                                    {formatCurrency(txn.amount)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={getStatusColor(
                                                            txn.transactionStatus
                                                        )}
                                                        variant="outline"
                                                    >
                                                        {txn.transactionStatus}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground hidden text-sm md:table-cell">
                                                    {txn.description || "—"}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <TransactionActions
                                                        transaction={txn}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )
                                ) : (
                                    // Hiển thị khi không có dữ liệu
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="text-muted-foreground h-24 text-center"
                                        >
                                            Không có giao dịch nào.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    {/* Pagination Controls */}
                    {pageData &&
                        //@ts-ignore
                        pageData.totalPages > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-muted-foreground text-sm">
                                    Hiển thị trang{" "}
                                    {
                                        //@ts-ignore
                                        pageData.number + 1
                                    }{" "}
                                    /{" "}
                                    {
                                        //@ts-ignore
                                        pageData.totalPages
                                    }{" "}
                                    (Tổng{" "}
                                    {
                                        //@ts-ignore
                                        pageData.totalElements
                                    }{" "}
                                    bản ghi)
                                </div>
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handlePageChange(page - 1);
                                                }}
                                                className={
                                                    //@ts-ignore
                                                    pageData.first
                                                        ? "pointer-events-none opacity-50"
                                                        : "cursor-pointer"
                                                }
                                            />
                                        </PaginationItem>

                                        {Array.from({
                                            //@ts-ignore
                                            length: pageData.totalPages,
                                        }).map((_, index) => (
                                            <PaginationItem key={index}>
                                                <PaginationLink
                                                    href="#"
                                                    isActive={page === index}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handlePageChange(index);
                                                    }}
                                                >
                                                    {index + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}

                                        <PaginationItem>
                                            <PaginationNext
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handlePageChange(page + 1);
                                                }}
                                                className={
                                                    //@ts-ignore
                                                    pageData.last
                                                        ? "pointer-events-none opacity-50"
                                                        : "cursor-pointer"
                                                }
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                </CardContent>
            </Card>
        </div>
    );
}
