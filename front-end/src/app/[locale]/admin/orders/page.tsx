"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Edit, Eye, MoreHorizontal, Search, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/format-price"; // Giả sử bạn đang dùng hàm này từ các component trước
import { fDateTime } from "@/lib/format-date-time"; // Hàm format thời gian bạn vừa tạo

// 1. Định nghĩa Interface cho dữ liệu (Nên chuyển vào file type riêng)
interface AdminOrder {
    id: string;
    customerName: string;
    customerEmail: string;
    totalAmount: number;
    status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    createdAt: string;
}

// Mock data để demo giao diện
const mockOrders: AdminOrder[] = [
    {
        id: "ORD-7352",
        customerName: "Nguyễn Văn A",
        customerEmail: "nguyenvana@example.com",
        totalAmount: 1250000,
        status: "PENDING",
        createdAt: "2026-03-04T08:47:06.738Z",
    },
    {
        id: "ORD-8491",
        customerName: "Trần Thị B",
        customerEmail: "tranthib@example.com",
        totalAmount: 3400000,
        status: "PROCESSING",
        createdAt: "2026-03-03T14:20:00.000Z",
    },
    {
        id: "ORD-9102",
        customerName: "Lê Văn C",
        customerEmail: "levanc@example.com",
        totalAmount: 850000,
        status: "DELIVERED",
        createdAt: "2026-03-01T09:15:00.000Z",
    },
    {
        id: "ORD-1123",
        customerName: "Phạm D",
        customerEmail: "phamd@example.com",
        totalAmount: 5600000,
        status: "CANCELLED",
        createdAt: "2026-02-28T16:45:00.000Z",
    },
];

export default function AdminOrderManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    // 2. Hàm render màu sắc Badge tùy theo trạng thái
    const getStatusBadge = (status: AdminOrder["status"]) => {
        switch (status) {
            case "PENDING":
                return (
                    <Badge
                        variant="outline"
                        className="border-yellow-600 bg-yellow-50 text-yellow-600"
                    >
                        Chờ xác nhận
                    </Badge>
                );
            case "PROCESSING":
                return (
                    <Badge
                        variant="outline"
                        className="border-blue-600 bg-blue-50 text-blue-600"
                    >
                        Đang xử lý
                    </Badge>
                );
            case "SHIPPED":
                return (
                    <Badge
                        variant="outline"
                        className="border-purple-600 bg-purple-50 text-purple-600"
                    >
                        Đang giao
                    </Badge>
                );
            case "DELIVERED":
                return (
                    <Badge
                        variant="outline"
                        className="border-green-600 bg-green-50 text-green-600"
                    >
                        Đã giao
                    </Badge>
                );
            case "CANCELLED":
                return (
                    <Badge
                        variant="outline"
                        className="border-red-600 bg-red-50 text-red-600"
                    >
                        Đã hủy
                    </Badge>
                );
            default:
                return <Badge variant="outline">Không rõ</Badge>;
        }
    };

    return (
        <div className="mx-auto max-w-7xl space-y-6 p-6">
            {/* Header */}
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
                    {/* Bộ lọc và Tìm kiếm */}
                    <div className="flex flex-col justify-between gap-4 sm:flex-row">
                        <div className="relative w-full sm:w-72">
                            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                            <Input
                                placeholder="Tìm mã đơn, tên khách hàng..."
                                className="bg-slate-50/50 pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="w-full bg-slate-50/50 sm:w-[180px]">
                                    <SelectValue placeholder="Trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">
                                        Tất cả trạng thái
                                    </SelectItem>
                                    <SelectItem value="PENDING">
                                        Chờ xác nhận
                                    </SelectItem>
                                    <SelectItem value="PROCESSING">
                                        Đang xử lý
                                    </SelectItem>
                                    <SelectItem value="SHIPPED">
                                        Đang giao
                                    </SelectItem>
                                    <SelectItem value="DELIVERED">
                                        Đã giao
                                    </SelectItem>
                                    <SelectItem value="CANCELLED">
                                        Đã hủy
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {/* Bảng dữ liệu */}
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
                                {mockOrders.map((order) => (
                                    <TableRow
                                        key={order.id}
                                        className="transition-colors hover:bg-slate-50/50"
                                    >
                                        <TableCell className="font-medium">
                                            {order.id}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">
                                                    {order.customerName}
                                                </span>
                                                <span className="text-muted-foreground text-xs">
                                                    {order.customerEmail}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {fDateTime(
                                                order.createdAt,
                                                "dd/MM/yyyy HH:mm"
                                            )}
                                        </TableCell>
                                        <TableCell className="text-primary text-right font-semibold">
                                            {formatCurrency(order.totalAmount)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {getStatusBadge(order.status)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
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
                                                    className="w-[160px]"
                                                >
                                                    <DropdownMenuLabel>
                                                        Hành động
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <Eye className="mr-2 h-4 w-4 text-blue-500" />
                                                        Xem chi tiết
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <Edit className="mr-2 h-4 w-4 text-yellow-500" />
                                                        Cập nhật trạng thái
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

                    {/* Phân trang cơ bản (Pagination) */}
                    <div className="flex items-center justify-between space-x-2 py-4">
                        <div className="text-muted-foreground text-sm">
                            Hiển thị <strong>1-4</strong> trên{" "}
                            <strong>20</strong> đơn hàng.
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled>
                                Trước
                            </Button>
                            <Button variant="outline" size="sm">
                                Tiếp theo
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}