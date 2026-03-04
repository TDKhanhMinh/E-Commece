"use client";

import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Attribute } from "@/type/product-type";
import { useCreateSku } from "@/hooks/use-products";
import { useAttributes } from "@/hooks/use-attributes";

interface ManualCreateSkuDialogProps {
    productId: number;
}

export function ManualCreateSkuDialog({
    productId,
}: ManualCreateSkuDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { data: attributesData } = useAttributes({ size: 1000 });
    const attributes = (attributesData as any)?.content || [];
    const createSkuMutation = useCreateSku(productId);

    const form = useForm({
        defaultValues: {
            skuCode: "",
            price: 0,
            stock: 0,
            image: "",
            attributes: [{ attributeId: "", value: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "attributes",
    });

    const onSubmit = (data: any) => {
        const payload = {
            ...data,
            attributes: data.attributes.map((attr: any) => ({
                attributeId: Number(attr.attributeId),
                value: attr.value,
            })),
        };
        createSkuMutation.mutate(payload, {
            onSuccess: () => {
                setIsOpen(false);
                form.reset();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Thêm thủ công SKU
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Tạo biến thể mới</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="skuCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mã SKU</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Giá</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Number(e.target.value)
                                                    )
                                                }
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="stock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tồn kho</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Number(e.target.value)
                                                    )
                                                }
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Link ảnh</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-3 rounded-md border p-4">
                            <div className="flex justify-between">
                                <h4 className="font-medium">
                                    Thuộc tính biến thể (Màu, Size...)
                                </h4>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        append({ attributeId: "", value: "" })
                                    }
                                >
                                    Thêm thuộc tính
                                </Button>
                            </div>
                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="flex items-end gap-2"
                                >
                                    <FormField
                                        control={form.control}
                                        name={`attributes.${index}.attributeId`}
                                        render={({ field }) => (
                                            <FormItem className="w-1/2">
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn thuộc tính" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {attributes.map(
                                                            (
                                                                attr: Attribute
                                                            ) => (
                                                                <SelectItem
                                                                    key={
                                                                        attr.id
                                                                    }
                                                                    value={attr.id.toString()}
                                                                >
                                                                    {attr.name}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`attributes.${index}.value`}
                                        render={({ field }) => (
                                            <FormItem className="w-1/2">
                                                <FormControl>
                                                    <Input
                                                        placeholder="Giá trị (Vd: Đỏ, XL)"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => remove(index)}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button type="submit" className="w-full">
                            Lưu SKU
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
