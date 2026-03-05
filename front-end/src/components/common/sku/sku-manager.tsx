"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductDetail, SkuDto } from "@/type/product-type";
import { SkuTable } from "./sku-table";
import {
    AutoGenerateSkuDialog,
    ManualCreateSkuDialog,
} from "@/components/common";
import { EditSkuDialog } from "./edit-sku-dialog";
import { useToggleSkuStatus } from "@/hooks/use-products";

interface SkuManagerProps {
    product: ProductDetail;
}

export function SkuManager({ product }: SkuManagerProps) {
    const [isAutoDialogOpen, setIsAutoDialogOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    // @ts-ignore
    const [selectedSku, setSelectedSku] = useState<SkuDto>(null);

    // Initialize the toggle mutation hook
    const toggleSkuStatus = useToggleSkuStatus(product.id);

    console.log("product in sku manager", product);
    console.log("selectedSku", selectedSku);

    const handleToggleActive = (sku: SkuDto) => {
        // Toggle the current status
        const newStatus = !sku.isActive;

        // Call the mutation with skuId and new status
        toggleSkuStatus.mutate({
            skuId: sku.id,
            isActive: newStatus,
        });
    };
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                    Danh sách biến thể (SKUs)
                </h3>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setIsAutoDialogOpen(true)}
                    >
                        Auto Generate SKU
                    </Button>
                    <ManualCreateSkuDialog productId={product.id} />
                </div>
            </div>

            <SkuTable
                product={product}
                onEdit={(sku) => {
                    setSelectedSku(sku);
                    setEditOpen(true);
                }}
                onToggleActive={(sku) => {
                    handleToggleActive(sku);
                }}
            />
            <EditSkuDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                productId={product.id}
                sku={selectedSku}
            />
            <AutoGenerateSkuDialog
                open={isAutoDialogOpen}
                onOpenChange={setIsAutoDialogOpen}
                productId={product.id}
            />
        </div>
    );
}
