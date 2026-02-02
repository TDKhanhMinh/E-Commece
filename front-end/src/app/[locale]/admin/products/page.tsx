"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    Package,
    Pencil,
    Plus,
    Search,
    Trash2,
} from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useDeleteProduct, useProducts } from "@/hooks/use-products";
import { ProductList } from "@/type/product-type";

const PAGE_SIZE = 10;

export default function ProductsPage() {
    const router = useRouter();

    const [pageIndex, setPageIndex] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const { data: productPage, isLoading } = useProducts({
        page: pageIndex,
        size: PAGE_SIZE,
        keyword,
    });

    const deleteMutation = useDeleteProduct();

    const handleSearch = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setKeyword(e.target.value);
            setPageIndex(0);
        },
        []
    );

    const handleEdit = useCallback(
        (id: number) => router.push(`/admin/products/${id}`),
        [router]
    );

    const handleDelete = useCallback(() => {
        if (!deletingId) return;

        deleteMutation.mutate(deletingId, {
            onSuccess: () => setDeletingId(null),
        });
    }, [deletingId, deleteMutation]);

    const formatCurrency = useCallback((value: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value);
    }, []);

    const hasPagination = useMemo(
        () => !!productPage && productPage.totalPages > 1,
        [productPage]
    );

    return (
        <div className="min-h-screen space-y-6 bg-gray-50/50 p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Sản phẩm
                    </h1>
                    <p className="text-muted-foreground">
                        Quản lý danh sách sản phẩm, giá và tồn kho.
                    </p>
                </div>

                <Button
                    className="cursor-pointer bg-blue-600 hover:bg-blue-700"
                    onClick={() => router.push("/admin/products/new")}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm sản phẩm
                </Button>
            </div>

            <div className="flex max-w-md items-center space-x-2 rounded-md border bg-white px-2 shadow-sm">
                <Search className="ml-2 h-4 w-4 text-gray-500" />
                <Input
                    value={keyword}
                    onChange={handleSearch}
                    placeholder="Tìm kiếm theo tên sản phẩm..."
                    className="border-none shadow-none focus-visible:ring-0"
                />
            </div>

            <div className="rounded-md border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-20">Ảnh</TableHead>
                            <TableHead>Tên sản phẩm</TableHead>
                            <TableHead>Danh mục</TableHead>
                            <TableHead>Thương hiệu</TableHead>
                            <TableHead className="text-right">
                                Giá Min
                            </TableHead>
                            <TableHead className="text-right">
                                Hành động
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading && (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="h-32 text-center text-gray-400"
                                >
                                    Đang tải dữ liệu...
                                </TableCell>
                            </TableRow>
                        )}

                        {!isLoading && productPage?.content.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-muted-foreground h-32 text-center"
                                >
                                    Không tìm thấy sản phẩm nào.
                                </TableCell>
                            </TableRow>
                        )}

                        {productPage?.content.map((product: ProductList) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <Avatar className="h-10 w-10 rounded-md border">
                                        <AvatarImage
                                            src={product.image}
                                            alt={product.name}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="rounded-md bg-gray-100">
                                            <Package className="h-5 w-5 text-gray-400" />
                                        </AvatarFallback>
                                    </Avatar>
                                </TableCell>

                                <TableCell>
                                    <div className="font-medium text-blue-950">
                                        {product.name}
                                    </div>
                                    <div className="font-mono text-xs text-gray-500">
                                        {product.slug}
                                    </div>
                                </TableCell>

                                <TableCell>{product.categoryName}</TableCell>
                                <TableCell>{product.brandName}</TableCell>

                                <TableCell className="text-right font-medium text-red-600">
                                    {formatCurrency(product.minPrice)}
                                </TableCell>

                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 cursor-pointer p-0"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>
                                                Thao tác
                                            </DropdownMenuLabel>

                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleEdit(product.id)
                                                }
                                            >
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Chỉnh sửa
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                className="text-red-600 focus:text-red-600"
                                                onClick={() =>
                                                    setDeletingId(product.id)
                                                }
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Xóa
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {hasPagination && (
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={pageIndex === 0 || isLoading}
                        onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Trang trước
                    </Button>

                    <div className="text-sm font-medium">
                        Trang {pageIndex + 1} / {productPage?.totalPages}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={
                            isLoading ||
                            pageIndex >= (productPage?.totalPages ?? 1) - 1
                        }
                        onClick={() => setPageIndex((p) => p + 1)}
                    >
                        Trang sau
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}

            <AlertDialog
                open={!!deletingId}
                onOpenChange={(open) => !open && setDeletingId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Xác nhận xóa sản phẩm?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Hành động này sẽ xóa sản phẩm vĩnh viễn, bao gồm
                            toàn bộ SKU và dữ liệu liên quan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteMutation.isPending}>
                            Hủy
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deleteMutation.isPending
                                ? "Đang xóa..."
                                : "Xóa vĩnh viễn"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
