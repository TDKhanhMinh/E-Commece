"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ProductDetail, SkuDto } from "@/type/product-type";
import { useDeleteSku } from "@/hooks/use-products";

interface SkuTableProps {
    product: ProductDetail;
    onEdit: (sku: SkuDto) => void;
    onToggleActive?: (sku: any) => void;
}

const PAGE_SIZE = 5;

export function SkuTable({ product, onEdit, onToggleActive }: SkuTableProps) {
    const t = useTranslations("products.sku.table");
    const deleteSkuMutation = useDeleteSku(product.id);
    const [page, setPage] = useState(1);

    const skus = product.variants ?? [];
    const totalPages = Math.ceil(skus.length / PAGE_SIZE);

    const pagedSkus = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return skus.slice(start, start + PAGE_SIZE);
    }, [skus, page]);

    return (
        <div className="space-y-3">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t("code")}</TableHead>
                        <TableHead>{t("image")}</TableHead>
                        <TableHead>{t("attributes")}</TableHead>
                        <TableHead>{t("originalPrice")}</TableHead>
                        <TableHead>{t("discount")}</TableHead>
                        <TableHead>{t("salePrice")}</TableHead>
                        <TableHead>{t("stock")}</TableHead>
                        <TableHead className="text-right">
                            {useTranslations("products.table")("actions")}
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {pagedSkus.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={8}
                                className="text-muted-foreground text-center text-sm"
                            >
                                {t("empty")}
                            </TableCell>
                        </TableRow>
                    )}

                    {pagedSkus.map((sku) => {
                        const originalPrice = sku.price;
                        const discountPercent = sku.discountPercent || 0;
                        const salePrice =
                            (sku as any).salePrice ||
                            (sku as any).finalPrice ||
                            originalPrice;

                        return (
                            <TableRow key={sku.id}>
                                <TableCell className="font-medium">
                                    {sku.skuCode}
                                </TableCell>

                                <TableCell>
                                    {sku.image && (
                                        <img
                                            src={sku.image}
                                            alt="sku"
                                            className="h-10 w-10 rounded object-cover"
                                        />
                                    )}
                                </TableCell>

                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {Object.entries(sku.attributes).map(
                                            ([key, val]) => (
                                                <span
                                                    key={key}
                                                    className="rounded bg-gray-100 dark:bg-slate-800 dark:text-slate-300 px-2 py-1 text-xs"
                                                >
                                                    {key}: {val}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </TableCell>

                                {/* Giá gốc */}
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span
                                            className={
                                                discountPercent > 0
                                                    ? "text-sm text-gray-400 dark:text-slate-500 line-through"
                                                    : "font-semibold text-slate-950 dark:text-slate-200"
                                            }
                                        >
                                            {originalPrice.toLocaleString()} đ
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Giảm giá */}
                                <TableCell>
                                    {discountPercent > 0 ? (
                                        <span className="inline-block rounded-full bg-red-100 dark:bg-red-950/30 px-2 py-1 text-xs font-semibold text-red-600 dark:text-red-400">
                                            -{discountPercent}%
                                        </span>
                                    ) : (
                                        <span className="text-sm text-gray-400 dark:text-slate-600">
                                            -
                                        </span>
                                    )}
                                </TableCell>

                                {/* Giá bán */}
                                <TableCell>
                                    <span className="font-semibold text-green-600 dark:text-green-400">
                                        {salePrice.toLocaleString()} đ
                                    </span>
                                </TableCell>

                                {/* Kho */}
                                <TableCell>
                                    <span
                                        className={
                                            sku.stock > 0
                                                ? "text-gray-900 dark:text-slate-200"
                                                : "font-semibold text-red-500 dark:text-red-400"
                                        }
                                    >
                                        {sku.stock}
                                    </span>
                                </TableCell>

                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(sku)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            deleteSkuMutation.mutate(sku.id)
                                        }
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                        {useTranslations("products")("pagination.pageInfo", {
                            current: page,
                            total: totalPages,
                        })}
                    </span>

                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
