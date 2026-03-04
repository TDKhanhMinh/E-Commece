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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Brand } from "@/type/brand-type";
import { useCreateBrand, useUpdateBrand } from "@/hooks/use-brands";

const formSchema = z.object({
    name: z.string().min(1, "Tên thương hiệu không được để trống"),
    description: z.string().optional(),
    logo: z.string().optional(),
});

interface BrandDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    brandToEdit?: Brand | null;
}

export function BrandDialog({
    open,
    onOpenChange,
    brandToEdit,
}: BrandDialogProps) {
    const createMutation = useCreateBrand();
    const updateMutation = useUpdateBrand();
    const isEditing = !!brandToEdit;
    const isLoading = createMutation.isPending || updateMutation.isPending;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "", description: "", logo: "" },
    });

    // Reset form khi mở dialog
    useEffect(() => {
        if (open) {
            form.reset({
                name: brandToEdit?.name || "",
                description: brandToEdit?.description || "",
                logo: brandToEdit?.logo || "",
            });
        }
    }, [open, brandToEdit, form]);

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (isEditing && brandToEdit) {
            updateMutation.mutate(
                { id: brandToEdit.id, data: values },
                { onSuccess: () => onOpenChange(false) }
            );
        } else {
            createMutation.mutate(values, {
                onSuccess: () => onOpenChange(false),
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? "Cập nhật thương hiệu"
                            : "Thêm thương hiệu mới"}
                    </DialogTitle>
                    <DialogDescription>
                        Quản lý thông tin đối tác và nhà cung cấp.
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
                                    <FormLabel>Tên thương hiệu</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Apple, Samsung..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="logo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Logo (URL)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="https://example.com/logo.png"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mô tả</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Thông tin thêm..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => onOpenChange(false)}
                            >
                                Hủy
                            </Button>
                            <Button type="submit" disabled={isLoading}>
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
