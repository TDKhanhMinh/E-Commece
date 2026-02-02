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
import { Attribute } from "@/type/attribute-type";
import { useCreateAttribute, useUpdateAttribute } from "@/hooks/use-attributes";

// Schema Validation
const formSchema = z.object({
    name: z.string().min(1, "Tên thuộc tính không được để trống"),
    code: z
        .string()
        .min(1, "Mã code không được để trống")
        .regex(/^[a-zA-Z0-9_]+$/, "Mã chỉ chứa chữ, số và gạch dưới"),
    type: z.enum(["TEXT", "SELECT", "NUMBER"] as const, {
        error: "Vui lòng chọn loại thuộc tính",
    }),
});
interface AttributeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    attributeToEdit?: Attribute | null;
}

export function AttributeDialog({
    open,
    onOpenChange,
    attributeToEdit,
}: AttributeDialogProps) {
    const createMutation = useCreateAttribute();
    const updateMutation = useUpdateAttribute();
    const isEditing = !!attributeToEdit;
    const isLoading = createMutation.isPending || updateMutation.isPending;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "", code: "", type: "TEXT" },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                name: attributeToEdit?.name || "",
                code: attributeToEdit?.code || "",
                type: attributeToEdit?.type || "TEXT",
            });
        }
    }, [open, attributeToEdit, form]);

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (isEditing && attributeToEdit) {
            updateMutation.mutate(
                { id: attributeToEdit.id, data: values },
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
                            ? "Cập nhật thuộc tính"
                            : "Thêm thuộc tính mới"}
                    </DialogTitle>
                    <DialogDescription>
                        Định nghĩa các thông số cho sản phẩm (Màu, Size,
                        RAM...).
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
                                    <FormLabel>Tên hiển thị</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ví dụ: Màu sắc"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Mã code (Dùng trong hệ thống)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ví dụ: color, ram_size"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kiểu dữ liệu</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn kiểu" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="TEXT">
                                                Text (Nhập tay)
                                            </SelectItem>
                                            <SelectItem value="SELECT">
                                                Select (Chọn danh sách)
                                            </SelectItem>
                                            <SelectItem value="NUMBER">
                                                Number (Số)
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
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
