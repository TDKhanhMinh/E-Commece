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
import { useTranslations } from "next-intl";

export default function AdminVoucherPage() {
    const t = useTranslations("vouchers");
    const { useAdminVouchers, adminVoucherActions } = useVoucher();
    const { data: vouchers, isLoading } = useAdminVouchers();

    const handleDisable = (id: number, action: boolean) => {
        adminVoucherActions.disable.mutate(
            { id, action },
            {
                onSuccess: () => {
                    if (action) {
                        toast.success(t("messages.reactivateSuccess"));
                    } else {
                        toast.success(t("messages.disableSuccess"));
                    }
                },
                onError: () => toast.error(t("messages.error")),
            }
        );
    };

    if (isLoading)
        return <div className="p-8 text-center">{t("loading")}</div>;

    return (
        <div className="bg-gray-50/50 dark:bg-slate-950 min-h-screen space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {t("title")}
                    </h1>
                    <p className="text-muted-foreground">
                        {t("description")}
                    </p>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex max-w-sm items-center space-x-2 rounded-md border dark:border-slate-800 bg-white dark:bg-slate-900 px-2 shadow-sm">
                    <Search className="ml-2 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder={t("searchPlaceholder")}
                        className="border-none shadow-none focus-visible:ring-0 text-gray-900 dark:text-slate-100"
                    />
                </div>
                <ActionVoucherDialog />
            </div>
            <div className="rounded-lg border dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t("table.codeDesc")}</TableHead>
                            <TableHead>{t("table.discountType")}</TableHead>
                            <TableHead>{t("table.value")}</TableHead>
                            <TableHead>{t("table.minOrder")}</TableHead>
                            <TableHead>{t("table.validity")}</TableHead>
                            <TableHead>{t("table.status")}</TableHead>
                            <TableHead className="text-right">
                                {t("table.actions")}
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vouchers?.content?.map((v) => (
                            <TableRow key={v.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-2">
                                            <Ticket className="h-4 w-4 text-red-500 dark:text-red-400" />
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
                                            ? t("table.types.percentage")
                                            : t("table.types.fixed")}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-medium text-blue-600 dark:text-blue-400">
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
                                            {t("table.dateUntil")}{" "}
                                            {fDateTime(
                                                new Date(v.endDate),
                                                "dd/MM/yyyy"
                                            )}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {v.active ? (
                                        <Badge className="gap-1 border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30">
                                            <CircleCheck className="h-3 w-3" />{" "}
                                            {t("table.statusActive")}
                                        </Badge>
                                    ) : (
                                        <Badge
                                            variant="secondary"
                                            className="gap-1 dark:bg-slate-800 dark:text-slate-400"
                                        >
                                            <CircleX className="h-3 w-3" /> {t("table.statusDisabled")}
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
                                                    <Pencil className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                                </Button>
                                            }
                                        />

                                        <ConfirmDialog
                                            title={
                                                v.active
                                                    ? t("confirm.disableTitle")
                                                    : t("confirm.enableTitle")
                                            }
                                            description={
                                                v.active
                                                    ? t("confirm.disableDesc", { code: v.code })
                                                    : t("confirm.enableDesc", { code: v.code })
                                            }
                                            confirmText={
                                                v.active
                                                    ? t("confirm.disableBtn")
                                                    : t("confirm.enableBtn")
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
                        {t("empty")}
                    </div>
                )}
            </div>
        </div>
    );
}
