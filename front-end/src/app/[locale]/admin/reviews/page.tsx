"use client";
import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search, Star, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDeleteReview, useReviewsAdmin } from "@/hooks/use-review";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useTranslations } from "next-intl";

const AdminReviewPage = () => {
    const t = useTranslations("reviews");
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);
    const pageSize = 10;

    const { data, isLoading, isError } = useReviewsAdmin({
        search: searchTerm,
        page: page,
        size: pageSize,
    });

    const deleteMutation = useDeleteReview();
    //@ts-ignore
    const reviews = data?.content || [];
    //@ts-ignore
    const totalPages = data?.totalPages || 0;

    const handleDelete = (id: number) => {
        deleteMutation.mutate(id);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    if (isLoading)
        return (
            <div className="p-10 text-center text-gray-500 dark:text-slate-400">
                {t("loading")}
            </div>
        );
    if (isError)
        return (
            <div className="p-10 text-center text-red-500">{t("error")}</div>
        );

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{t("title")}</h1>
                <div className="relative w-64">
                    <Search className="absolute top-2.5 left-2 h-4 w-4 text-gray-400 dark:text-slate-500" />
                    <Input
                        placeholder={t("searchPlaceholder")}
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(0);
                        }}
                    />
                </div>
            </div>

            <div className="rounded-md border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
                            <TableCell className="font-bold py-4">
                                {t("table.customer")}
                            </TableCell>
                            <TableCell className="font-bold">
                                {t("table.product")}
                            </TableCell>
                            <TableCell className="font-bold">
                                {t("table.rating")}
                            </TableCell>
                            <TableCell className="font-bold">
                                {t("table.content")}
                            </TableCell>
                            <TableCell className="font-bold">
                                {t("table.date")}
                            </TableCell>
                            <TableCell className="font-bold text-right">
                                {t("table.actions")}
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reviews.length > 0 ? (
                            reviews.map((review: any) => (
                                <TableRow
                                    key={review.id}
                                    className="transition-colors hover:bg-gray-50 dark:hover:bg-slate-900 border-b border-gray-100 dark:border-slate-800/50"
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={review.reviewerImage}
                                                alt={review.reviewerName}
                                                className="h-10 w-10 rounded-full border border-gray-200 dark:border-slate-800 object-cover"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm leading-none font-semibold">
                                                    {review.reviewerName}
                                                </span>
                                                {review.isVerified && (
                                                    <span className="mt-1 text-[10px] font-medium text-green-600 dark:text-green-500">
                                                        {t("verified")}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">
                                                {review.productName}
                                            </span>
                                            <span className="text-xs text-gray-400 dark:text-slate-500">
                                                Slug: {review.productSlug}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center text-yellow-500">
                                            <span className="mr-1 font-bold">
                                                {review.rating}
                                            </span>
                                            <Star className="h-4 w-4 fill-current" />
                                        </div>
                                    </TableCell>

                                    <TableCell className="max-w-75">
                                        <div className="flex flex-col">
                                            <span className="truncate text-sm font-semibold">
                                                {review.title}
                                            </span>
                                            <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-slate-400 italic">
                                                "{review.content}"
                                            </p>
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-xs text-gray-500 dark:text-slate-400">
                                        {new Date(
                                            review.reviewDate
                                        ).toLocaleString(undefined, {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700 dark:hover:text-red-400"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        {t("dialog.deleteTitle")}
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        {t.rich(
                                                            "dialog.deleteDescription",
                                                            {
                                                                reviewer:
                                                                    review.reviewerName,
                                                                product:
                                                                    review.productName,
                                                                b: (chunks) => (
                                                                    <b className="font-bold">
                                                                        {chunks}
                                                                    </b>
                                                                ),
                                                            }
                                                        )}
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        {t("dialog.cancel")}
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            handleDelete(
                                                                review.id
                                                            )
                                                        }
                                                        className="bg-red-500 hover:bg-red-600"
                                                        disabled={
                                                            deleteMutation.isPending
                                                        }
                                                    >
                                                        {deleteMutation.isPending
                                                            ? t("dialog.deleting")
                                                            : t("dialog.confirm")}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="h-24 text-center text-gray-500 dark:text-slate-400"
                                >
                                    {t("empty")}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <div className="flex items-center justify-between border-t border-gray-200 dark:border-slate-800 px-4 py-4">
                    <div className="text-sm text-gray-500 dark:text-slate-400">
                        {t("pagination.summary", {
                            count: reviews.length,
                            total:
                                //@ts-ignore
                                data?.totalElements || 0,
                        })}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 0}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            {t("pagination.prev")}
                        </Button>

                        <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">
                                {t("pagination.page", { page: page + 1 })}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-slate-400">
                                / {totalPages}
                            </span>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page >= totalPages - 1}
                        >
                            {t("pagination.next")}
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReviewPage;
