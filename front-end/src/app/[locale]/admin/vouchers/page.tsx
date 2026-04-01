"use client";

import React from "react";
import { useVoucher } from "@/hooks/use-voucher";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    CircleCheck,
    CircleX,
    Pencil,
    Search,
    Ticket,
} from "lucide-react";
import { toast } from "sonner";
import { fDateTime } from "@/lib/format-date-time";
import { ActionVoucherDialog } from "@/components/common/dialog/action-voucher-dialog";
import { ConfirmDialog } from "@/components/common/dialog/confirm-dialog";
import { Switch } from "@/components/ui/switch";
import {Input} from "@/components/ui/input";

export default function AdminVoucherPage() {
    const { useAdminVouchers, adminVoucherActions } = useVoucher();
    const { data: vouchers, isLoading } = useAdminVouchers();

    const handleDisable = (id: number, action: boolean) => {
        adminVoucherActions.disable.mutate(
            { id, action },
            {
                onSuccess: () => {
                    if (action) {
                        toast.success("Đã kích hoạt lại mã giảm giá");
                    } else {
                        toast.success("Đã vô hiệu hóa mã giảm giá");
                    }
                },
                onError: () => toast.error("Có lỗi xảy ra"),
            }
        );
    };

    if (isLoading)
        return <div className="p-8 text-center">Đang tải dữ liệu...</div>;

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Quản lý Voucher
                    </h1>
                    <p className="text-muted-foreground">
                        Tạo và quản lý các chương trình khuyến mãi hệ thống.
                    </p>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex max-w-sm items-center space-x-2 rounded-md border bg-white px-2 shadow-sm">
                    <Search className="ml-2 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Tìm theo tên hoặc mã..."
                        className="border-none shadow-none focus-visible:ring-0"
                    />
                </div>
                <ActionVoucherDialog />
            </div>
            <div className="rounded-lg border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mã / Mô tả</TableHead>
                            <TableHead>Loại giảm</TableHead>
                            <TableHead>Giá trị</TableHead>
                            <TableHead>Đơn tối thiểu</TableHead>
                            <TableHead>Hiệu lực</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right">
                                Thao tác
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vouchers?.content?.map((v) => (
                            <TableRow key={v.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-red-50 p-2">
                                            <Ticket className="h-4 w-4 text-red-500" />
                                        </div>
                                        <div>
                                            <div className="font-bold">
                                                {v.code}
                                            </div>
                                            <div className="text-muted-foreground line-clamp-1 text-xs">
                                                {v.description}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">
                                        {v.discountType === "PERCENTAGE"
                                            ? "Phần trăm (%)"
                                            : "Tiền mặt (đ)"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-medium text-blue-600">
                                    {v.discountType === "PERCENTAGE"
                                        ? `${v.discountValue}%`
                                        : `${v.discountValue.toLocaleString()}đ`}
                                </TableCell>
                                <TableCell>
                                    {v.minOrder.toLocaleString()}đ
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1 text-xs">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3 text-slate-400" />
                                            {fDateTime(
                                                new Date(v.startDate),
                                                "dd/MM/yyyy"
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="h-3 w-3" />
                                            đến{" "}
                                            {fDateTime(
                                                new Date(v.endDate),
                                                "dd/MM/yyyy"
                                            )}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {v.active ? (
                                        <Badge className="gap-1 border-green-200 bg-green-50 text-green-700 hover:bg-green-50">
                                            <CircleCheck className="h-3 w-3" />{" "}
                                            Hoạt động
                                        </Badge>
                                    ) : (
                                        <Badge
                                            variant="secondary"
                                            className="gap-1"
                                        >
                                            <CircleX className="h-3 w-3" /> Đã
                                            tắt
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <ActionVoucherDialog
                                            voucher={v}
                                            trigger={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                >
                                                    <Pencil className="h-4 w-4 text-slate-600" />
                                                </Button>
                                            }
                                        />

                                        <ConfirmDialog
                                            title={
                                                v.active
                                                    ? "Vô hiệu hóa mã giảm giá?"
                                                    : "Mở lại mã giảm giá?"
                                            }
                                            description={
                                                v.active
                                                    ? `Bạn có chắc chắn muốn vô hiệu hóa mã "${v.code}"? Người dùng sẽ không thể sử dụng mã này cho các đơn hàng mới nữa.`
                                                    : `Bạn có chắc chắn muốn mở lại mã "${v.code}"? Người dùng sẽ có thể tiếp tục lưu và sử dụng mã này cho đơn hàng.`
                                            }
                                            confirmText={
                                                v.active
                                                    ? "Vô hiệu hóa"
                                                    : "Kích hoạt"
                                            }
                                            destructive={v.active}
                                            onConfirm={() =>
                                                handleDisable(v.id, !v.active)
                                            }
                                            trigger={
                                                <button
                                                    type="button"
                                                    className="flex h-8 w-8 items-center justify-center rounded-md transition-colors outline-none hover:bg-slate-50"
                                                >
                                                    <Switch
                                                        checked={v.active}
                                                    />
                                                </button>
                                            }
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {vouchers?.empty && (
                    <div className="text-muted-foreground p-12 text-center">
                        Chưa có mã giảm giá nào được tạo.
                    </div>
                )}
            </div>
        </div>
    );
}
