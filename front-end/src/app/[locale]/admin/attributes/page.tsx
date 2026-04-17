"use client";

import { useEffect, useState } from "react";
import {
    MoreHorizontal,
    Pencil,
    Plus,
    Search,
    Settings2,
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
import { Badge } from "@/components/ui/badge";
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

import { useAttributes, useDeleteAttribute } from "@/hooks/use-attributes";
import { Attribute } from "@/type/attribute-type";
import useDebounce from "@/hooks/use-debounce";
import { PageResponse } from "@/type/api-type";
import { AttributeDialog, PaginationControl } from "@/components/common";

/* =========================
 * COMPONENT
 * ========================= */
export default function AttributesPage() {
    /* =========================
     * STATE
     * ========================= */
    const [keyword, setKeyword] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(
        null
    );
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(0); // Backend uses 0-based page
    const itemsPerPage = 10;

    // Debounce search keyword
    const debouncedKeyword = useDebounce(keyword, 500);

    /* =========================
     * DATA FETCHING
     * ========================= */
    const { data, isLoading } = useAttributes({
        page: currentPage,
        size: itemsPerPage,
        keyword: debouncedKeyword || undefined,
    });

    // Extract page response data
    const pageData = data as PageResponse<Attribute> | undefined;
    const attributes = pageData?.content || [];
    const totalPages = pageData?.totalPages || 0;

    const deleteMutation = useDeleteAttribute();

    /* =========================
     * EFFECTS
     * ========================= */
    // Reset to first page when search keyword changes
    useEffect(() => {
        setCurrentPage(0);
    }, [debouncedKeyword]);

    /* =========================
     * HANDLERS
     * ========================= */
    const handleCreate = () => {
        setEditingAttribute(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (attr: Attribute) => {
        setEditingAttribute(attr);
        setIsDialogOpen(true);
    };

    const handleDelete = () => {
        if (!deletingId) return;

        deleteMutation.mutate(deletingId, {
            onSuccess: () => setDeletingId(null),
        });
    };

    const handlePageChange = (page: number) => {
        // Convert from 1-based (UI) to 0-based (backend)
        setCurrentPage(page - 1);
    };

    const handleSearchChange = (value: string) => {
        setKeyword(value);
        // No need to reset page here, useEffect will handle it
    };

    /* =========================
     * HELPERS
     * ========================= */
    const renderTypeBadge = (type: string) => {
        switch (type) {
            case "SELECT":
                return (
                    <Badge className="bg-blue-500 dark:bg-blue-600 dark:text-blue-50">
                        Select
                    </Badge>
                );
            case "NUMBER":
                return (
                    <Badge className="bg-purple-500 dark:bg-purple-600 dark:text-purple-50">
                        Number
                    </Badge>
                );
            default:
                return (
                    <Badge
                        variant="secondary"
                        className="dark:bg-slate-800 dark:text-slate-300"
                    >
                        Text
                    </Badge>
                );
        }
    };

    /* =========================
     * RENDER
     * ========================= */
    return (
        <>
            <div className="min-h-screen space-y-6 bg-gray-50/50 dark:bg-slate-950 p-8">
                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Thuộc tính sản phẩm
                        </h1>
                        <p className="text-muted-foreground">
                            Định nghĩa các thông số như Màu sắc, Kích thước,
                            RAM...
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    {/* SEARCH */}
                    <div className="flex max-w-sm items-center space-x-2 rounded-md border dark:border-slate-800 bg-white dark:bg-slate-900 px-2 shadow-sm">
                        <Search className="ml-2 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Tìm theo tên hoặc mã..."
                            value={keyword}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="border-none shadow-none focus-visible:ring-0"
                        />
                    </div>
                    <Button
                        onClick={handleCreate}
                        className="cursor-pointer bg-blue-600 hover:bg-blue-700"
                    >
                        Thêm thuộc tính
                    </Button>
                </div>
                {/* TABLE */}
                <div className="rounded-md border dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12.5" />
                                <TableHead>Tên hiển thị</TableHead>
                                <TableHead>Mã code</TableHead>
                                <TableHead>Kiểu dữ liệu</TableHead>
                                <TableHead className="text-right">
                                    Hành động
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {isLoading && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="h-24 text-center"
                                    >
                                        Đang tải...
                                    </TableCell>
                                </TableRow>
                            )}

                            {!isLoading && attributes.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="h-24 text-center"
                                    >
                                        Không tìm thấy dữ liệu.
                                    </TableCell>
                                </TableRow>
                            )}

                            {!isLoading &&
                                attributes.map((attr: Attribute) => (
                                    <TableRow key={attr.id}>
                                        <TableCell>
                                            <Settings2 className="h-5 w-5 text-gray-400 dark:text-slate-500" />
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {attr.name}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-gray-500 dark:text-slate-500">
                                            {attr.code}
                                        </TableCell>
                                        <TableCell>
                                            {renderTypeBadge(attr.type)}
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
                                                            handleEdit(attr)
                                                        }
                                                    >
                                                        <Pencil className="mr-2 h-4 w-4" />{" "}
                                                        Chỉnh sửa
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() =>
                                                            setDeletingId(
                                                                attr.id
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />{" "}
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

                {/* PAGINATION */}
                {!isLoading && totalPages > 1 && (
                    <div className="flex justify-center">
                        <PaginationControl
                            currentPage={currentPage + 1}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>

            {/* CREATE / EDIT DIALOG */}
            <AttributeDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                attributeToEdit={editingAttribute}
            />

            {/* DELETE CONFIRM */}
            <AlertDialog
                open={!!deletingId}
                onOpenChange={(open) => !open && setDeletingId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xóa thuộc tính?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Nếu thuộc tính đang được sử dụng bởi sản phẩm, việc
                            xóa có thể gây lỗi hiển thị hoặc mất dữ liệu.
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
        </>
    );
}
