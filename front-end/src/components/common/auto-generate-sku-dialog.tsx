import { useAutoGenerateProductSku } from "@/hooks/use-products";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AttributeInput {
    attributeId: string;
    values: string;
}
export default function AutoGenerateSkuDialog({
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
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [attributes, setAttributes] = useState<AttributeInput[]>([
        { attributeId: "", values: "" },
    ]);

    const handleAddAttribute = () => {
        setAttributes([...attributes, { attributeId: "", values: "" }]);
    };

    const handleRemoveAttribute = (index: number) => {
        if (attributes.length === 1) return;
        setAttributes(attributes.filter((_, i) => i !== index));
    };

    const handleChange = (
        index: number,
        field: keyof AttributeInput,
        value: string
    ) => {
        const next = [...attributes];
        next[index][field] = value;
        setAttributes(next);
    };
    const handleSubmit = () => {
        const payload = {
            price: Number(price),
            stock: Number(stock),
            attributes: attributes.map((a) => ({
                attributeId: Number(a.attributeId),
                values: a.values.split(",").map((v) => v.trim()),
            })),
        };

        autoGenerateSku(payload, {
            onSuccess: () => {
                onOpenChange(false);
            },
        });

        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Auto Generate SKU</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Default Price</Label>
                        <Input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label>Default Stock</Label>
                        <Input
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-4 space-y-4">
                    <Label>Attributes</Label>

                    {attributes.map((attr, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-12 items-center gap-2"
                        >
                            <Input
                                className="col-span-3"
                                placeholder="Attribute ID"
                                value={attr.attributeId}
                                onChange={(e) =>
                                    handleChange(
                                        index,
                                        "attributeId",
                                        e.target.value
                                    )
                                }
                            />
                            <Input
                                className="col-span-8"
                                placeholder="Values (comma separated)"
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
                                variant="ghost"
                                size="icon"
                                className="col-span-1"
                                onClick={() => handleRemoveAttribute(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddAttribute}
                        className="flex gap-2"
                    >
                        <Plus className="h-4 w-4" /> Add Attribute
                    </Button>
                </div>
                <Button onClick={handleSubmit} disabled={isAutoGenerating}>
                    {isAutoGenerating ? "Generating..." : "Generate SKU"}
                </Button>
            </DialogContent>
        </Dialog>
    );
}
