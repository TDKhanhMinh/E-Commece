"use client";

import { useState } from "react";
import { FolderTree, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { useCategories, useDeleteCategory } from "@/hooks/use-categories";
import { Category } from "@/service/categories-service";
import { CategoryDialog } from "@/components/common/category-dialog";
import ConfirmAction from "@/components/common/confirm-action";
import { flattenCategories } from "@/lib/flatten-categories";

export default function CategoriesPage() {
    const { data: categories = [], isLoading } = useCategories();
    const deleteMutation = useDeleteCategory();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null
    );

    const flatCategories = flattenCategories(categories);

    const handleCreate = () => {
        setEditingCategory(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: number) => {
        deleteMutation.mutate(id);
    };

    return (
        <div className="bg-muted/30 min-h-screen space-y-6 p-6 md:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Danh mục sản phẩm
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Quản lý cấu trúc danh mục và phân cấp
                    </p>
                </div>

                <Button onClick={handleCreate} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Thêm danh mục
                </Button>
            </div>

            <Card className="border-muted shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="w-105">
                                    Tên danh mục
                                </TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Cấp độ</TableHead>
                                <TableHead className="text-right">
                                    Hành động
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {isLoading &&
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={4}>
                                            <Skeleton className="h-6 w-full" />
                                        </TableCell>
                                    </TableRow>
                                ))}

                            {!isLoading && flatCategories.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-muted-foreground h-24 text-center text-sm"
                                    >
                                        Chưa có danh mục nào
                                    </TableCell>
                                </TableRow>
                            )}

                            {!isLoading &&
                                flatCategories.map((category) => (
                                    <TableRow
                                        key={category.id}
                                        className="hover:bg-muted/40"
                                    >
                                        <TableCell className="font-medium">
                                            <div
                                                className="flex items-center"
                                                style={{
                                                    paddingLeft: `${
                                                        category.level * 24
                                                    }px`,
                                                }}
                                            >
                                                {category.level > 0 && (
                                                    <div className="border-muted-foreground/30 mr-2 h-4 w-4 rounded-bl border-b-2 border-l-2" />
                                                )}
                                                <FolderTree className="text-primary mr-2 h-4 w-4" />
                                                {category.name}
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-muted-foreground font-mono text-xs">
                                            {category.slug}
                                        </TableCell>

                                        <TableCell>
                                            <Badge
                                                variant={
                                                    category.level === 0
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {category.level === 0
                                                    ? "Gốc"
                                                    : `Cấp ${category.level}`}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
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
                                                            handleEdit(category)
                                                        }
                                                    >
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Chỉnh sửa
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-600"
                                                        onSelect={(e) =>
                                                            e.preventDefault()
                                                        }
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        <ConfirmAction
                                                            title="Delete Category"
                                                            btnText="Xóa"
                                                            description="Hành động này không thể hoàn tác"
                                                            requiredText="DELETE"
                                                            actionText="Xóa vĩnh viễn"
                                                            isPending={
                                                                deleteMutation.isPending
                                                            }
                                                            onConfirm={() =>
                                                                handleDelete(
                                                                    category.id
                                                                )
                                                            }
                                                        />
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <CategoryDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                categoryToEdit={editingCategory}
                categoriesTree={categories}
            />
        </div>
    );
}
