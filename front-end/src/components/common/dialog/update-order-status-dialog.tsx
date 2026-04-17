"use client";

import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useUpdateOrderStatus } from "@/hooks/use-order";

interface UpdateStatusDialogProps {
    orderId: string | number | null;
    currentStatus: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UpdateStatusDialog({
    orderId,
    currentStatus,
    open,
    onOpenChange,
}: UpdateStatusDialogProps) {
    const [newStatus, setNewStatus] = useState(currentStatus);
    const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

    useEffect(() => {
        if (open) {
            setNewStatus(currentStatus);
        }
    }, [open, currentStatus]);

    const statusOptions = [
        { value: "PENDING", label: "Chưa xác nhận" },
        { value: "CONFIRMED", label: "Đã xác nhận" },
        { value: "UNPAID", label: "Chưa thanh toán" },
        { value: "PAID", label: "Đã thanh toán" },
        { value: "SHIPPING", label: "Đang giao hàng" },
        { value: "DELIVERED", label: "Đã giao hàng" },
        { value: "CANCELLED", label: "Đã hủy" },
        { value: "FAILED", label: "Thanh toán thất bại" },
    ];

    const handleSave = () => {
        if (!orderId) return;

        updateStatus(
            { orderId: Number(orderId), status: newStatus },
            {
                onSuccess: () => {
                    onOpenChange(false);
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-100">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        Cập nhật đơn hàng
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-5 py-4">
                    <div className="flex flex-col gap-2">
                        <Label className="text-muted-foreground">
                            Mã đơn hàng
                        </Label>
                        <span className="font-mono text-lg font-bold dark:text-slate-100">
                            #{orderId}
                        </span>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="status-select">
                            Trạng thái vận chuyển
                        </Label>
                        <Select
                            value={newStatus}
                            onValueChange={setNewStatus}
                            disabled={isPending}
                        >
                            <SelectTrigger
                                id="status-select"
                                className="w-full"
                            >
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((opt) => (
                                    <SelectItem
                                        key={opt.value}
                                        value={opt.value}
                                    >
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isPending || newStatus === currentStatus}
                        className="min-w-30"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang lưu...
                            </>
                        ) : (
                            "Xác nhận"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
