// app/transactions/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
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
import { Download, Eye, Filter, Loader2, MoreHorizontal, Pencil, RefreshCcw, Trash2 } from "lucide-react";
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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import { useTransactionsAdmin, useTransactionsPaymentAdmin, useUpdateTransactionStatus } from "@/hooks/use-transaction";
import { PaymentTransaction, TransactionResponse } from "@/type/transaction-type";
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

const TransactionActions = ({
    transaction,
}: {
    transaction: TransactionResponse;
}) => {
    const t = useTranslations("transactions");
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">{t("dropdown.trigger")}</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{t("dropdown.label")}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {}}>
                        <Eye className="mr-2 h-4 w-4 text-blue-500" />
                        <span>{t("dropdown.view")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsUpdateOpen(true)}>
                        <Pencil className="mr-2 h-4 w-4 text-yellow-500" />
                        <span>{t("dropdown.update")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {}}>
                        <Download className="mr-2 h-4 w-4 text-green-500" />
                        <span>{t("dropdown.export")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => {}}
                        className="text-red-600 focus:text-red-600 cursor-pointer"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>{t("dropdown.delete")}</span>
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

const UpdateTransactionStatusDialog = ({
    transaction,
    open,
    onOpenChange,
}: {
    transaction: TransactionResponse;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) => {
    const t = useTranslations("transactions");
    const [selectedStatus, setSelectedStatus] = useState<string>(transaction.transactionStatus);
    const { mutate: updateStatus, isPending } = useUpdateTransactionStatus();

    const handleUpdate = () => {
        updateStatus(
            { transactionId: transaction.transactionId, status: selectedStatus },
            { onSuccess: () => onOpenChange(false) }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t("updateDialog.title", { id: transaction.transactionId })}</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <RadioGroup value={selectedStatus} onValueChange={setSelectedStatus} className="grid grid-cols-2 gap-2">
                        {[
                            { label: t("status.pending"), value: "PENDING" },
                            { label: t("status.success"), value: "SUCCESS" },
                            { label: t("status.failed"), value: "FAILED" },
                            { label: t("status.rejected"), value: "REJECTED" },
                        ].map((item) => (
                            <div key={item.value} className="flex items-center space-x-2 rounded-md border p-3 hover:bg-slate-50 transition-colors cursor-pointer">
                                <RadioGroupItem value={item.value} id={`update-status-${item.value}`} />
                                <Label htmlFor={`update-status-${item.value}`} className="flex-1 cursor-pointer font-medium">{item.label}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>{t("updateDialog.cancel")}</Button>
                    <Button onClick={handleUpdate} disabled={isPending || selectedStatus === transaction.transactionStatus}>
                        {isPending ? <RefreshCcw className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {t("updateDialog.confirm")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default function TransactionManagement() {
    const t = useTranslations("transactions");
    const [page, setPage] = useState(0);
    const [viewType, setViewType] = useState<"wallet" | "payment">("wallet");
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

    const commonParams = {
        page,
        size,
        startDate: filters.startDate || null,
        endDate: filters.endDate || null,
    };

    const walletParams = {
        ...commonParams,
        status: filters.status === "ALL" ? null : filters.status,
        type: filters.type === "ALL" ? null : filters.type,
        action: filters.action === "ALL" ? null : filters.action,
    };

    const walletQuery = useTransactionsAdmin(walletParams);
    const paymentQuery = useTransactionsPaymentAdmin(commonParams);

    const activeQuery = viewType === "wallet" ? walletQuery : paymentQuery;
    const { data: pageData, isLoading, isError } = activeQuery;

    const getActionLabel = (action: string) => {
        const labels: Record<string, string> = {
            "DELIVERY_FEE": t("action.deliveryFee"),
            "BONUS": t("action.bonus"),
            "WITHDRAW_TO_BANK": t("action.withdraw"),
            "PENALTY": t("action.penalty"),
            "COD_PAYMENT": t("action.cod"),
        };
        return labels[action] || action;
    };

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

    const activeFilterCount = Object.entries(filters).reduce((acc, [key, value]) => {
        if (key === "status" || key === "type" || key === "action") {
            return value !== "ALL" ? acc + 1 : acc;
        }
        return value ? acc + 1 : acc;
    }, 0);

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
                <Tabs value={viewType} onValueChange={(v) => { setViewType(v as any); setPage(0); }} className="w-full md:w-auto">
                    <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                        <TabsTrigger value="wallet">
                            {t("tabs.wallet") || "Giao dịch ví"}
                        </TabsTrigger>
                        <TabsTrigger value="payment">
                            {t("tabs.payment") || "Thanh toán đơn hàng"}
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-semibold">
                        {viewType === "wallet" ? "Danh sách giao dịch hệ thống" : "Danh sách thanh toán từ đối tác"}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        {viewType === "wallet" && (
                            <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="relative size-9 p-0 md:size-auto md:px-4 md:py-2">
                                        <Filter className="h-4 w-4 md:mr-2" />
                                        <span className="hidden md:inline">{t("filters.button")}</span>
                                        {activeFilterCount > 0 && (
                                            <Badge 
                                                variant="destructive" 
                                                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]"
                                            >
                                                {activeFilterCount}
                                            </Badge>
                                        )}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>{t("filters.title")}</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-6 py-4">
                                        <div className="space-y-3">
                                            <Label className="text-base font-semibold">{t("filters.status")}</Label>
                                            <RadioGroup
                                                value={tempFilters.status}
                                                onValueChange={(value) => setTempFilters(prev => ({ ...prev, status: value }))}
                                                className="grid grid-cols-2 gap-2 sm:grid-cols-3"
                                            >
                                                {[
                                                    { label: t("status.all"), value: "ALL" },
                                                    { label: t("status.pending"), value: "PENDING" },
                                                    { label: t("status.success"), value: "SUCCESS" },
                                                    { label: t("status.failed"), value: "FAILED" },
                                                    { label: t("status.rejected"), value: "REJECTED" },
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

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">{t("filters.startDate")}</Label>
                                                <Input 
                                                    type="date" 
                                                    value={tempFilters.startDate}
                                                    onChange={(e) => setTempFilters(prev => ({ ...prev, startDate: e.target.value }))}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">{t("filters.endDate")}</Label>
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
                                            className="text-red-500 hover:bg-red-50 hover:text-red-600"
                                        >
                                            <RefreshCcw className="mr-2 h-4 w-4" />
                                            {t("filters.reset")}
                                        </Button>
                                        <Button onClick={handleApplyFilters}>
                                            {t("filters.apply")}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                        <Button variant="outline" size="icon" onClick={() => activeQuery.refetch()}>
                            <RefreshCcw className={cn("h-4 w-4", activeQuery.isFetching && "animate-spin")} />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="w-full overflow-x-auto rounded-md border">
                        <Table className="min-w-[800px]">
                            <TableHeader>
                                {viewType === "wallet" ? (
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="w-[100px]">{t("table.id")}</TableHead>
                                        <TableHead>{t("table.time")}</TableHead>
                                        <TableHead>{t("table.type")}</TableHead>
                                        <TableHead>{t("table.amount")}</TableHead>
                                        <TableHead>{t("table.status")}</TableHead>
                                        <TableHead className="hidden md:table-cell">{t("table.description")}</TableHead>
                                        <TableHead className="w-[50px] text-right">{t("table.actions")}</TableHead>
                                    </TableRow>
                                ) : (
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="w-[100px]">ID</TableHead>
                                        <TableHead>Thời gian</TableHead>
                                        <TableHead>Mã đơn/Email</TableHead>
                                        <TableHead>Mã GD</TableHead>
                                        <TableHead>Số tiền</TableHead>
                                        <TableHead>PTTT/Ngân hàng</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                    </TableRow>
                                )}
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={viewType === "wallet" ? 7 : 7} className="h-24 text-center text-muted-foreground">
                                            <div className="flex items-center justify-center">
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                {t("loading")}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : isError ? (
                                    <TableRow>
                                        <TableCell colSpan={viewType === "wallet" ? 7 : 7} className="h-24 text-center font-medium text-red-500">
                                            {t("error")}
                                        </TableCell>
                                    </TableRow>
                                ) : //@ts-ignore
                                pageData && pageData.content.length > 0 ? (
                                    //@ts-ignore
                                    pageData.content.map((txn: any) => (
                                        viewType === "wallet" ? (
                                            <TableRow key={txn.transactionId}>
                                                <TableCell className="font-medium">#{txn.transactionId}</TableCell>
                                                <TableCell>{fDateTime(txn.createdAt, "dd/MM/yyyy HH:mm:ss")}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className={txn.type === "CREDIT" ? "font-semibold text-green-600" : "font-semibold text-red-600"}>
                                                            {txn.type === "CREDIT" ? t("type.credit") : t("type.debit")}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">{getActionLabel(txn.transactionAction)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-bold">{formatCurrency(txn.amount)}</TableCell>
                                                <TableCell>
                                                    <Badge className={getStatusColor(txn.transactionStatus)} variant="outline">
                                                        {txn.transactionStatus}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="hidden text-sm text-muted-foreground md:table-cell">{txn.description || "—"}</TableCell>
                                                <TableCell className="text-right">
                                                    <TransactionActions transaction={txn} />
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            <TableRow key={txn.id}>
                                                <TableCell className="font-medium">#{txn.id}</TableCell>
                                                <TableCell>{fDateTime(txn.createdAt, "dd/MM/yyyy HH:mm:ss")}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-blue-600">#{txn.orderId}</span>
                                                        <span className="text-xs text-muted-foreground truncate max-w-[150px]">{txn.userEmail}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-mono text-xs">{txn.transactionCode}</TableCell>
                                                <TableCell className="font-bold">{formatCurrency(Number(txn.amount))}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-semibold">{txn.paymentMethod}</span>
                                                        <span className="text-[10px] text-muted-foreground">{txn.bankCode}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={txn.status === "SUCCESS" ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-red-100 text-red-800 hover:bg-red-100"} variant="outline">
                                                        {txn.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={viewType === "wallet" ? 7 : 7} className="h-24 text-center text-muted-foreground">
                                            {t("empty")}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            {//@ts-ignore
                            pageData && t("pagination.summary", { 
                                //@ts-ignore
                                page: pageData.number + 1, 
                                //@ts-ignore
                                total: pageData.totalPages, 
                                //@ts-ignore
                                records: pageData.totalElements 
                            })}
                        </div>
                        {//@ts-ignore
                        pageData && pageData.totalPages > 1 && (
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (page > 0) setPage(page - 1);
                                            }}
                                            className={//@ts-ignore
                                                pageData.first ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>

                                    {Array.from({ //@ts-ignore
                                        length: pageData.totalPages,
                                    }).map((_, index) => (
                                        <PaginationItem key={index}>
                                            <PaginationLink
                                                href="#"
                                                isActive={page === index}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setPage(index);
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
                                                //@ts-ignore
                                                if (page < pageData.totalPages - 1) setPage(page + 1);
                                            }}
                                            className={//@ts-ignore
                                                pageData.last ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
