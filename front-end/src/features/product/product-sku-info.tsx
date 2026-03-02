"use client";

interface ProductSkuInfoProps {
    sku: {
        skuCode: string;
        stock: number;
    } | null;
}

export function ProductSkuInfo({ sku }: ProductSkuInfoProps) {
    if (!sku) return null;

    return (
        <div className="border-primary/20 bg-primary/5 my-6 rounded-lg border p-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-muted-foreground text-sm font-medium">
                        Mã SKU:
                    </p>
                    <p
                        className="font-mono text-sm font-semibold"
                        itemProp="sku"
                    >
                        {sku.skuCode}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-muted-foreground text-sm font-medium">
                        Tồn kho:
                    </p>
                    <p
                        className={`font-semibold ${
                            sku.stock > 0 ? "text-green-600" : "text-red-600"
                        }`}
                    >
                        <link
                            itemProp="availability"
                            href={
                                sku.stock > 0
                                    ? "https://schema.org/InStock"
                                    : "https://schema.org/OutOfStock"
                            }
                        />
                        {sku.stock > 0 ? `${sku.stock} sản phẩm` : "Hết hàng"}
                    </p>
                </div>
            </div>
        </div>
    );
}
