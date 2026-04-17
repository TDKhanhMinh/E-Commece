"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
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
    const t = useTranslations("vouchers.dialog");
    const tVoucher = useTranslations("vouchers");
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
                        toast.success(tVoucher("messages.updateSuccess"));
                        setOpen(false);
                    },
                    onError: (error: any) => {
                        const msg =
                            error?.response?.data?.message ||
                            tVoucher("messages.updateError");
                        toast.error(msg);
                    },
                }
            );
        } else {
            // Logic Tạo mới
            adminVoucherActions.create.mutate(payload, {
                onSuccess: () => {
                    toast.success(tVoucher("messages.createSuccess"));
                    setOpen(false);
                },
                onError: (error: any) => {
                    const msg =
                        error?.response?.data?.message ||
                        tVoucher("messages.createError");
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
                        {tVoucher("addVoucher")}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit
                            ? t("editTitle")
                            : t("addTitle")}
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 py-4"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">{t("labels.code")}</Label>
                            <Input
                                id="code"
                                placeholder={t("placeholders.code")}
                                disabled={isEdit}
                                {...register("code", {
                                    required: t("validation.codeRequired"),
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
                                {t("labels.type")}
                            </Label>
                            <select
                                id="discountType"
                                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100"
                                {...register("discountType")}
                            >
                                <option value="FIXED">
                                    {t("types.fixed")}
                                </option>
                                <option value="PERCENTAGE">
                                    {t("types.percentage")}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">{t("labels.description")}</Label>
                        <Input
                            id="description"
                            placeholder={t("placeholders.description")}
                            {...register("description", {
                                required: t("validation.descRequired"),
                            })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="discountValue">
                                {t("labels.value")}
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
                            <Label htmlFor="minOrder">{t("labels.minOrder")}</Label>
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
                                {t("labels.maxDiscount")}
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
                                {t("labels.usageLimit")}
                            </Label>
                            <Input
                                id="usageLimit"
                                type="number"
                                min="1"
                                placeholder={t("placeholders.usageLimit")}
                                {...register("usageLimit")}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">{t("labels.startDate")}</Label>
                            <Input
                                id="startDate"
                                type="datetime-local"
                                {...register("startDate", {
                                    required: t("validation.startRequired"),
                                })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endDate">{t("labels.endDate")}</Label>
                            <Input
                                id="endDate"
                                type="datetime-local"
                                {...register("endDate", {
                                    required: t("validation.endRequired"),
                                })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isPending}>
                            {isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {isEdit ? t("saveChanges") : t("confirmCreate")}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
