"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { SkuImageManager } from "@/components/common/sku-image-manager";
import { useUpdateSkuPriceStock } from "@/hooks/use-products";

interface EditSkuDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productId: number;
    sku: {
        id: number;
        skuCode: string;
        price: number;
        stock: number;
        attributes: Record<string, string>;
        images?: string[];
    } | null;
}

export function EditSkuDialog({
    open,
    onOpenChange,
    productId,
    sku,
}: EditSkuDialogProps) {
    const updateMutation = useUpdateSkuPriceStock(
        productId,
        sku?.id,
        sku?.images
    );

    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (!sku) return;

        setPrice(String(sku.price));
        setStock(String(sku.stock));
        setImages(sku.images ?? []);
    }, [sku]);

    const handleSubmit = () => {
        if (!sku) return;

        if (!price || !stock) {
            toast.error("Giá và tồn kho không được để trống");
            return;
        }

        updateMutation.mutate(
            {
                price: Number(price),
                stock: Number(stock),
                images,
            },
            {
                onSuccess: () => {
                    toast.success("Cập nhật SKU thành công");
                    onOpenChange(false);
                },
                onError: () => {
                    toast.error("Cập nhật SKU thất bại");
                },
            }
        );
    };

    if (!sku) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa SKU</DialogTitle>
                </DialogHeader>

                <div className="space-y-3 rounded-md border bg-gray-50 p-3">
                    <div className="space-y-1">
                        <Label>Mã SKU</Label>
                        <Input value={sku.skuCode} disabled />
                    </div>

                    <div className="space-y-1">
                        <Label>Thuộc tính</Label>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(sku.attributes).map(([k, v]) => (
                                <span
                                    key={k}
                                    className="rounded bg-gray-200 px-2 py-1 text-xs"
                                >
                                    {k}: {v}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label>Giá</Label>
                        <Input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label>Tồn kho</Label>
                        <Input
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                        />
                    </div>
                </div>

                <SkuImageManager
                    value={images}
                    onChange={setImages}
                    isUploading={isUploading}
                    onUploadingChange={setIsUploading}
                />

                <Button
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={updateMutation.isPending || isUploading}
                >
                    {updateMutation.isPending
                        ? "Đang cập nhật..."
                        : "Lưu thay đổi"}
                </Button>
            </DialogContent>
        </Dialog>
    );
}
