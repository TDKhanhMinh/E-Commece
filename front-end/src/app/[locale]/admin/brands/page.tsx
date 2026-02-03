"use client";

import { useEffect, useState } from "react";
import {
    Hexagon,
    MoreHorizontal,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useBrands, useDeleteBrand } from "@/hooks/use-brands";
import { Brand } from "@/type/brand-type";
import { BrandDialog } from "@/components/common";
import ConfirmAction from "@/components/common/dialog/confirm-action";
import { PaginationControl } from "@/components/common/ui";
import useDebounce from "@/hooks/use-debounce";
import { PageResponse } from "@/service/http";

export default function BrandsPage() {
    const [keyword, setKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(0); // Backend uses 0-based
    const itemsPerPage = 10;

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

    // Debounce search keyword
    const debouncedKeyword = useDebounce(keyword, 500);

    // Fetch brands with pagination
    const { data, isLoading } = useBrands({
        page: currentPage,
        size: itemsPerPage,
        keyword: debouncedKeyword || undefined,
    });

    const deleteMutation = useDeleteBrand();

    // Extract page response data
    const pageData = data as PageResponse<Brand> | undefined;
    const brands = pageData?.content || [];
    const totalPages = pageData?.totalPages || 0;

    // Reset to first page when search keyword changes
    useEffect(() => {
        setCurrentPage(0);
    }, [debouncedKeyword]);

    const handleCreate = () => {
        setEditingBrand(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (brand: Brand) => {
        setEditingBrand(brand);
        setIsDialogOpen(true);
    };

    const handleDelete = (deletingId: number) => {
        deleteMutation.mutate(deletingId);
    };

    const handlePageChange = (page: number) => {
        // Convert from 1-based (UI) to 0-based (backend)
        setCurrentPage(page - 1);
    };

    const handleSearchChange = (value: string) => {
        setKeyword(value);
    };

    return (
        <div className="min-h-screen space-y-6 bg-gray-50/50 p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Thương hiệu
                    </h1>
                    <p className="text-muted-foreground">
                        Quản lý danh sách các hãng sản xuất.
                    </p>
                </div>
                <Button
                    onClick={handleCreate}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    <Plus className="mr-2 h-4 w-4" /> Thêm thương hiệu
                </Button>
            </div>

            <div className="flex max-w-sm items-center space-x-2 rounded-md border bg-white px-2 shadow-sm">
                <Search className="ml-2 h-4 w-4 text-gray-500" />
                <Input
                    placeholder="Tìm kiếm..."
                    value={keyword}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="border-none shadow-none focus-visible:ring-0"
                />
            </div>

            <div className="rounded-md border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-20">Logo</TableHead>
                            <TableHead>Tên thương hiệu</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead className="hidden md:table-cell">
                                Mô tả
                            </TableHead>
                            <TableHead className="text-right">
                                Hành động
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="h-24 text-center"
                                >
                                    Đang tải...
                                </TableCell>
                            </TableRow>
                        ) : brands.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="h-24 text-center"
                                >
                                    Không tìm thấy dữ liệu.
                                </TableCell>
                            </TableRow>
                        ) : (
                            brands.map((brand: Brand) => (
                                <TableRow key={brand.id}>
                                    <TableCell>
                                        <Avatar className="h-10 w-10 rounded-lg border">
                                            <AvatarImage
                                                src={brand.logo}
                                                className="object-contain"
                                            />
                                            <AvatarFallback>
                                                <Hexagon className="h-5 w-5 text-gray-400" />
                                            </AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {brand.name}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-gray-500">
                                        {brand.slug}
                                    </TableCell>
                                    <TableCell className="hidden max-w-75 truncate text-gray-500 md:table-cell">
                                        {brand.description}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
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
                                                        handleEdit(brand)
                                                    }
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" />{" "}
                                                    Chỉnh sửa
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onSelect={(e) =>
                                                        e.preventDefault()
                                                    }
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />{" "}
                                                    <ConfirmAction
                                                        title={
                                                            "Xóa thương hiệu"
                                                        }
                                                        btnText={"Xóa"}
                                                        description={
                                                            "Bạn có chắc chắn muốn xóa thương hiệu này không"
                                                        }
                                                        requiredText={"DELETE"}
                                                        actionText={"Xóa"}
                                                        onConfirm={() =>
                                                            handleDelete(
                                                                brand.id
                                                            )
                                                        }
                                                    />
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
                <div className="flex justify-center">
                    <PaginationControl
                        currentPage={currentPage + 1}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            <BrandDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                brandToEdit={editingBrand}
            />
        </div>
    );
}
