"use client";

import { useMemo, useState } from "react";
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
import { AttributeDialog } from "@/components/common/attribute-dialog";

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

    /* =========================
     * DATA FETCHING
     * ========================= */
    const { data: attributes = [], isLoading } = useAttributes();
    const deleteMutation = useDeleteAttribute();

    /* =========================
     * DERIVED DATA
     * ========================= */
    const filteredData = useMemo(() => {
        return attributes.filter(
            (item) =>
                item.name.toLowerCase().includes(keyword.toLowerCase()) ||
                item.code.toLowerCase().includes(keyword.toLowerCase())
        );
    }, [attributes, keyword]);

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

    /* =========================
     * HELPERS
     * ========================= */
    const renderTypeBadge = (type: string) => {
        switch (type) {
            case "SELECT":
                return <Badge className="bg-blue-500">Select</Badge>;
            case "NUMBER":
                return <Badge className="bg-purple-500">Number</Badge>;
            default:
                return <Badge variant="secondary">Text</Badge>;
        }
    };

    /* =========================
     * RENDER
     * ========================= */
    return (
        <>
            <div className="min-h-screen space-y-6 bg-gray-50/50 p-8">
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
                    <Button
                        onClick={handleCreate}
                        className="cursor-pointer bg-blue-600 hover:bg-blue-700"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Thêm thuộc tính
                    </Button>
                </div>

                {/* SEARCH */}
                <div className="flex max-w-sm items-center space-x-2 rounded-md border bg-white px-2 shadow-sm">
                    <Search className="ml-2 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Tìm theo tên hoặc mã..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="border-none shadow-none focus-visible:ring-0"
                    />
                </div>

                {/* TABLE */}
                <div className="rounded-md border bg-white shadow-sm">
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

                            {!isLoading && filteredData.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="h-24 text-center"
                                    >
                                        Không tìm thấy dữ liệu.
                                    </TableCell>
                                </TableRow>
                            )}

                            {filteredData.map((attr) => (
                                <TableRow key={attr.id}>
                                    <TableCell>
                                        <Settings2 className="h-5 w-5 text-gray-400" />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {attr.name}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-gray-500">
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
                                                        setDeletingId(attr.id)
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
