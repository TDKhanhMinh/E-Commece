"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
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
import { SkuImageManager } from "./sku-image-manager";
import { useUpdateSkuDetails } from "@/hooks/use-products";

interface EditSkuDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productId: number;
    sku: {
        id: number;
        skuCode: string;
        price: number;
        stock: number;
        discountPercent?: number;
        attributes: Record<string, string>;
        imagesDetails?: string[];
    } | null;
}

export function EditSkuDialog({
    open,
    onOpenChange,
    productId,
    sku,
}: EditSkuDialogProps) {
    const t = useTranslations("products.sku.dialogs.edit");
    const updateMutation = useUpdateSkuDetails(productId, sku?.id || 0);

    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [discountPercent, setDiscountPercent] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (!sku) return;

        setPrice(String(sku.price));
        setStock(String(sku.stock));
        setDiscountPercent(String(sku.discountPercent ?? 0));
        console.log("sku images details", sku.imagesDetails);
        setImages(sku.imagesDetails ?? []);
    }, [sku]);

    const handleSubmit = () => {
        if (!sku) return;

        if (!price || !stock) {
            toast.error(t("errors.emptyPriceStock"));
            return;
        }

        const discountValue = Number(discountPercent) || 0;

        // Validate discount percent (0-100)
        if (discountValue < 0 || discountValue > 100) {
            toast.error(t("errors.invalidDiscount"));
            return;
        }

        updateMutation.mutate(
            {
                price: Number(price),
                stock: Number(stock),
                discountPercent: discountValue,
                images,
            },
            {
                onSuccess: () => {
                    toast.success(t("success"));
                    onOpenChange(false);
                },
                onError: () => {
                    toast.error(t("error"));
                },
            }
        );
    };

    if (!sku) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{t("title")}</DialogTitle>
                </DialogHeader>

                <div className="space-y-3 rounded-md border dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 p-3">
                    <div className="space-y-1">
                        <Label>{t("skuCode")}</Label>
                        <Input value={sku.skuCode} disabled />
                    </div>

                    <div className="space-y-1">
                        <Label>{t("attributes")}</Label>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(sku.attributes).map(([k, v]) => (
                                <span
                                    key={k}
                                    className="rounded bg-gray-200 dark:bg-slate-800 dark:text-slate-300 px-2 py-1 text-xs"
                                >
                                    {k}: {v}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label>{t("price")}</Label>
                        <Input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder={t("pricePlaceholder")}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label>{t("stock")}</Label>
                        <Input
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            placeholder={t("stockPlaceholder")}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <Label>{t("discount")}</Label>
                    <Input
                        type="number"
                        min="0"
                        max="100"
                        value={discountPercent}
                        onChange={(e) => {
                            const value = e.target.value;
                            // Validate input range
                            if (
                                value === "" ||
                                (Number(value) >= 0 && Number(value) <= 100)
                            ) {
                                setDiscountPercent(value);
                            }
                        }}
                        placeholder={t("discountPlaceholder")}
                    />
                    <p className="text-xs text-gray-500 dark:text-slate-500">
                        {t("discountHint")}
                    </p>
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
                        ? t("updating")
                        : t("saveChanges")}
                </Button>
            </DialogContent>
        </Dialog>
    );
}
