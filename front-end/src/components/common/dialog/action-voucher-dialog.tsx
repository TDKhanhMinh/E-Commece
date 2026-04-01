"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useVoucher } from "@/hooks/use-voucher";
import { VoucherRequest, VoucherResponse } from "@/type/voucher-type";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

interface ActionVoucherDialogProps {
    voucher?: VoucherResponse; // Nếu có truyền vào -> Chế độ Edit
    trigger?: ReactNode; // Tùy chỉnh nút mở Dialog
}

export function ActionVoucherDialog({
    voucher,
    trigger,
}: ActionVoucherDialogProps) {
    const [open, setOpen] = useState(false);
    const { adminVoucherActions } = useVoucher();

    const isEdit = !!voucher; // Xác định đang ở chế độ nào

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<VoucherRequest>({
        defaultValues: {
            discountType: "FIXED",
            active: true,
            minOrder: 0,
            discountValue: 0,
        },
    });

    const discountType = watch("discountType");
    const isPending = isEdit
        ? adminVoucherActions.update.isPending
        : adminVoucherActions.create.isPending;

    useEffect(() => {
        if (open) {
            if (isEdit && voucher) {
                reset({
                    code: voucher.code,
                    discountType: voucher.discountType,
                    description: voucher.description,
                    discountValue: voucher.discountValue,
                    minOrder: voucher.minOrder,
                    maxDiscount: voucher.maxDiscount || undefined,
                    usageLimit: voucher.usageLimit || undefined,
                    active: voucher.active,
                    startDate: voucher.startDate.slice(0, 16),
                    endDate: voucher.endDate.slice(0, 16),
                });
            } else {
                // Reset về rỗng nếu là Tạo mới
                reset({
                    discountType: "FIXED",
                    active: true,
                    minOrder: 0,
                    discountValue: 0,
                });
            }
        }
    }, [open, isEdit, voucher, reset]);

    const onSubmit = (data: VoucherRequest) => {
        const payload: VoucherRequest = {
            ...data,
            discountValue: Number(data.discountValue),
            minOrder: Number(data.minOrder),
            maxDiscount: data.maxDiscount ? Number(data.maxDiscount) : null,
            usageLimit: data.usageLimit ? Number(data.usageLimit) : null,
            startDate: new Date(data.startDate).toISOString(),
            endDate: new Date(data.endDate).toISOString(),
            active: isEdit ? voucher.active : true,
        };

        if (isEdit && voucher) {
            adminVoucherActions.update.mutate(
                { id: voucher.id, data: payload },
                {
                    onSuccess: () => {
                        toast.success("Cập nhật mã giảm giá thành công!");
                        setOpen(false);
                    },
                    onError: (error: any) => {
                        const msg =
                            error?.response?.data?.message ||
                            "Có lỗi xảy ra khi cập nhật voucher";
                        toast.error(msg);
                    },
                }
            );
        } else {
            // Logic Tạo mới
            adminVoucherActions.create.mutate(payload, {
                onSuccess: () => {
                    toast.success("Tạo mã giảm giá thành công!");
                    setOpen(false);
                },
                onError: (error: any) => {
                    const msg =
                        error?.response?.data?.message ||
                        "Có lỗi xảy ra khi tạo voucher";
                    toast.error(msg);
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? (
                    trigger
                ) : (
                    <Button className="gap-2">
                        Thêm Voucher mới
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit
                            ? "Cập nhật mã giảm giá"
                            : "Tạo mã giảm giá mới"}
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 py-4"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">Mã Voucher (Code) *</Label>
                            <Input
                                id="code"
                                placeholder="VD: FREESHIP2024"
                                disabled={isEdit}
                                {...register("code", {
                                    required: "Vui lòng nhập mã code",
                                })}
                            />
                            {errors.code && (
                                <p className="text-xs text-red-500">
                                    {errors.code.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="discountType">
                                Loại giảm giá *
                            </Label>
                            <select
                                id="discountType"
                                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                {...register("discountType")}
                            >
                                <option value="FIXED">
                                    Giảm tiền mặt (VNĐ)
                                </option>
                                <option value="PERCENTAGE">
                                    Giảm phần trăm (%)
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả hiển thị *</Label>
                        <Input
                            id="description"
                            placeholder="VD: Giảm 20k cho đơn từ 100k"
                            {...register("description", {
                                required: "Vui lòng nhập mô tả",
                            })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="discountValue">
                                Giá trị giảm *
                            </Label>
                            <Input
                                id="discountValue"
                                type="number"
                                min="0"
                                {...register("discountValue", {
                                    required: true,
                                    min: 0,
                                })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="minOrder">Đơn tối thiểu *</Label>
                            <Input
                                id="minOrder"
                                type="number"
                                min="0"
                                {...register("minOrder", {
                                    required: true,
                                    min: 0,
                                })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="maxDiscount">
                                Giảm tối đa (Tùy chọn)
                            </Label>
                            <Input
                                id="maxDiscount"
                                type="number"
                                min="0"
                                disabled={discountType === "FIXED"}
                                {...register("maxDiscount")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="usageLimit">
                                Giới hạn số lượng (Tùy chọn)
                            </Label>
                            <Input
                                id="usageLimit"
                                type="number"
                                min="1"
                                placeholder="Để trống nếu không giới hạn"
                                {...register("usageLimit")}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Ngày bắt đầu *</Label>
                            <Input
                                id="startDate"
                                type="datetime-local"
                                {...register("startDate", {
                                    required: "Chọn ngày bắt đầu",
                                })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endDate">Ngày kết thúc *</Label>
                            <Input
                                id="endDate"
                                type="datetime-local"
                                {...register("endDate", {
                                    required: "Chọn ngày kết thúc",
                                })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isPending}>
                            {isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {isEdit ? "Lưu thay đổi" : "Xác nhận tạo"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
