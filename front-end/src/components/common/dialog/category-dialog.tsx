"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateCategory, useUpdateCategory } from "@/hooks/use-categories";
import { Category } from "@/service/categories-service";
import { categorySchema } from "@/schema/category-schema";

interface CategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categoryToEdit?: Category | null;
    categoriesTree: Category[] | [];
}
type formCategoryData = z.infer<typeof categorySchema>;
export function CategoryDialog({
    open,
    onOpenChange,
    categoryToEdit,
    categoriesTree,
}: CategoryDialogProps) {
    const createMutation = useCreateCategory();
    const updateMutation = useUpdateCategory();

    const isEditing = !!categoryToEdit;
    const isLoading = createMutation.isPending || updateMutation.isPending;

    const form = useForm<formCategoryData>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            parentId: "root",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                name: categoryToEdit?.name || "",
                parentId: categoryToEdit?.parentId?.toString() || "root",
            });
        }
    }, [open, categoryToEdit, form]);

    const onSubmit = (values: formCategoryData) => {
        const parentId =
            values.parentId === "root" ? null : Number(values.parentId);

        const payload = {
            name: values.name,
            parentId: parentId,
        };

        if (isEditing && categoryToEdit) {
            updateMutation.mutate(
                { id: categoryToEdit.id, data: payload },
                { onSuccess: () => onOpenChange(false) }
            );
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => onOpenChange(false),
            });
        }
    };

    const renderCategoryOptions = (cats: Category[], prefix = "") => {
        return cats.map((cat) => (
            <div key={cat.id}>
                <SelectItem
                    value={cat.id.toString()}
                    disabled={cat.id === categoryToEdit?.id}
                >
                    {prefix} {cat.name}
                </SelectItem>

                {cat.children &&
                    cat.children.length > 0 &&
                    renderCategoryOptions(cat.children, prefix + "-- ")}
            </div>
        ));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Cập nhật danh mục" : "Thêm danh mục mới"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Chỉnh sửa thông tin danh mục"
                            : "Tạo danh mục mới vào hệ thống"}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên danh mục</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ví dụ: Laptop"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="parentId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Danh mục cha</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn danh mục cha" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem
                                                value="root"
                                                className="font-semibold text-blue-600"
                                            >
                                                Danh mục gốc
                                            </SelectItem>
                                            {renderCategoryOptions(
                                                categoriesTree
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => onOpenChange(false)}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className={"cursor-pointer"}
                            >
                                {isLoading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {isEditing ? "Lưu thay đổi" : "Tạo mới"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
