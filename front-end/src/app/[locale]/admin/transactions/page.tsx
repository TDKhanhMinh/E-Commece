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
import { Download, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

// Nhúng hook Admin vào trang
import { useTransactionsAdmin } from "@/hooks/use-transaction";
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
        default:
            return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
};

const getActionLabel = (action: TransactionResponse["transactionAction"]) => {
    switch (action) {
        case "DELIVERY_FEE":
            return "Cước giao hàng";
        case "WITHDRAW":
            return "Rút tiền";
        case "DEPOSIT":
            return "Nạp tiền";
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
                    <Eye className="mr-2 h-4 w-4" />
                    <span>Xem chi tiết</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyId}>
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>Cập nhật trạng thái</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    <span>Xuất file</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-red-600"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Xóa giao dịch</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default function TransactionManagement() {
    const [page, setPage] = useState(0);
    const size = 20;

    const {
        data: pageData,
        isLoading,
        isError,
    } = useTransactionsAdmin({ page, size });
    //@ts-ignore
    console.log("API Response in Component 1:", pageData.content);

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
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        Quản Lý Giao Dịch (Admin)
                    </CardTitle>
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
                                                                ? "+ Biến động tăng"
                                                                : "- Biến động giảm"}
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
