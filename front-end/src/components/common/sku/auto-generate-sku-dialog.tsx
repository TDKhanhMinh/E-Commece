"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useAutoGenerateProductSku } from "@/hooks/use-products";
import { useAttributes } from "@/hooks/use-attributes";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Attribute } from "@/type/product-type";

interface AttributeInput {
    attributeId: string;
    values: string;
}

export function AutoGenerateSkuDialog({
    open,
    onOpenChange,
    productId,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    productId: number;
}) {
    const { autoGenerateSku, isAutoGenerating } =
        useAutoGenerateProductSku(productId);

    const { data: attributesData } = useAttributes({ size: 1000 });
    const attributes = (attributesData as any)?.content || [];

    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [attributeInputs, setAttributeInputs] = useState<AttributeInput[]>([
        { attributeId: "", values: "" },
    ]);

    /* 
       Helpers
     */

    const selectedAttributeIds = useMemo(
        () => attributeInputs.map((a) => a.attributeId).filter(Boolean),
        [attributeInputs]
    );

    const handleAddAttribute = () => {
        setAttributeInputs([
            ...attributeInputs,
            { attributeId: "", values: "" },
        ]);
    };

    const handleRemoveAttribute = (index: number) => {
        if (attributeInputs.length === 1) return;
        setAttributeInputs(attributeInputs.filter((_, i) => i !== index));
    };

    const handleChange = (
        index: number,
        field: keyof AttributeInput,
        value: string
    ) => {
        const next = [...attributeInputs];
        next[index][field] = value;
        setAttributeInputs(next);
    };

    /* 
       Submit + Validate
     */

    const handleSubmit = () => {
        if (!price || !stock) {
            toast.error("Giá và tồn kho là bắt buộc");
            return;
        }

        for (const attr of attributeInputs) {
            if (!attr.attributeId || !attr.values.trim()) {
                toast.error("Vui lòng chọn thuộc tính và nhập giá trị");
                return;
            }
        }

        const payload = {
            price: Number(price),
            stock: Number(stock),
            attributes: attributeInputs.map((a) => ({
                attributeId: Number(a.attributeId),
                values: a.values
                    .split(",")
                    .map((v) => v.trim())
                    .filter(Boolean),
            })),
        };

        autoGenerateSku(payload, {
            onSuccess: () => {
                onOpenChange(false);
                setPrice("");
                setStock("");
                setAttributeInputs([{ attributeId: "", values: "" }]);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-lg max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Tự động tạo SKU theo tổ hợp</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Giá mặc định</Label>
                        <Input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="VD: 200000"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Tồn kho mặc định</Label>
                        <Input
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            placeholder="VD: 100"
                        />
                    </div>
                </div>

                <div className="mt-4 space-y-3 rounded-md border p-4">
                    <div className="flex items-center justify-between">
                        <Label className="font-medium">
                            Thuộc tính dùng để tạo tổ hợp
                        </Label>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddAttribute}
                        >
                            <Plus className="mr-1 h-4 w-4" />
                            Thêm thuộc tính
                        </Button>
                    </div>

                    {attributeInputs.map((attr, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-12 items-center gap-2"
                        >
                            <Select
                                value={attr.attributeId}
                                onValueChange={(v) =>
                                    handleChange(index, "attributeId", v)
                                }
                            >
                                <SelectTrigger className="col-span-4">
                                    <SelectValue placeholder="Chọn thuộc tính" />
                                </SelectTrigger>
                                <SelectContent>
                                    {attributes?.map((a: Attribute) => (
                                        <SelectItem
                                            key={a.id}
                                            value={a.id.toString()}
                                            disabled={selectedAttributeIds.includes(
                                                a.id.toString()
                                            )}
                                        >
                                            {a.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Input
                                className="col-span-7 mx-4"
                                placeholder="VD: Đỏ, Xanh, Trắng"
                                value={attr.values}
                                onChange={(e) =>
                                    handleChange(
                                        index,
                                        "values",
                                        e.target.value
                                    )
                                }
                            />

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="col-span-1 text-red-500"
                                onClick={() => handleRemoveAttribute(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="rounded-md bg-blue-50 p-3 text-xs text-blue-700">
                    Mỗi thuộc tính chỉ chọn một lần. Nhập nhiều giá trị (cách
                    nhau bằng dấu phẩy) để hệ thống tạo các tổ hợp SKU tương
                    ứng.
                </div>

                <Button
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={isAutoGenerating}
                >
                    {isAutoGenerating ? "Đang tạo SKU..." : "Tạo SKU tự động"}
                </Button>
            </DialogContent>
        </Dialog>
    );
}
