import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItemResponse } from "@/type/cart-type";
import { formatCurrency } from "@/lib/format-price";

interface CartItemCardProps {
    item: CartItemResponse;
    onUpdateQuantity: (
        skuId: number,
        currentQuantity: number,
        delta: number,
        maxStock: number
    ) => void;
    onRemove: (skuId: number, productName: string) => void;
    isUpdating: boolean;
    isRemoving: boolean;
}

export function CartItemCard({
    item,
    onUpdateQuantity,
    onRemove,
    isUpdating,
    isRemoving,
}: CartItemCardProps) {
    console.log("Rendering CartItemCard for SKU:", item);
    const totalPrice = item.salePrice
        ? item.salePrice * item.quantity
        : item.price * item.quantity;
    const inStock = item.quantity <= item.stock;
    return (
        <Card className="overflow-hidden border-none bg-slate-50/50 shadow-sm">
            <CardContent className="p-4">
                <div className="flex gap-4">
                    <div className="h-24 w-24 shrink-0 rounded-lg border bg-white p-2">
                        <img
                            src={item.productImage || "/placeholder.png"}
                            alt={item.productName}
                            className="h-full w-full object-contain"
                        />
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                        <div>
                            <div className="flex justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        {item.productName}
                                    </h3>
                                    <p className="text-muted-foreground text-xs">
                                        SKU: {item.skuCode}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-destructive"
                                    onClick={() =>
                                        onRemove(item.skuId, item.productName)
                                    }
                                    disabled={isRemoving}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {Object.entries(item.attributes).map(
                                    ([key, value]) => (
                                        <span
                                            key={key}
                                            className="text-muted-foreground rounded border bg-white px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase"
                                        >
                                            {key}: {value}
                                        </span>
                                    )
                                )}
                            </div>
                            {inStock && (
                                <p className="text-destructive mt-2 text-sm">
                                    Sản phẩm tạm hết hàng
                                </p>
                            )}
                        </div>

                        <div className="mt-4 flex items-end justify-between">
                            <div className="flex items-center rounded-md border bg-white">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-none border-r"
                                    onClick={() =>
                                        onUpdateQuantity(
                                            item.skuId,
                                            item.quantity,
                                            -1,
                                            item.stock
                                        )
                                    }
                                    disabled={item.quantity <= 1 || isUpdating}
                                >
                                    <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-10 text-center text-sm font-medium">
                                    {item.quantity}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-none border-l"
                                    onClick={() => {
                                        console.log(
                                            "Attempting to increase quantity for SKU:",
                                            item.skuId,
                                            "Current quantity:",
                                            item.quantity,
                                            "Item details:",
                                            item.stock
                                        );
                                        onUpdateQuantity(
                                            item.skuId,
                                            item.quantity,
                                            1,
                                            item.stock
                                        );
                                    }}
                                    disabled={
                                        item.quantity >= item.stock ||
                                        isUpdating
                                    }
                                >
                                    <Plus className="h-3 w-3" />
                                </Button>
                            </div>
                            <div className="text-right">
                                {item.discountPercent &&
                                    item.discountPercent > 0 && (
                                        <p className="text-muted-foreground mb-1 text-xs line-through">
                                            {formatCurrency(item.price)}
                                        </p>
                                    )}
                                <p className="text-primary text-lg font-bold">
                                    {formatCurrency(item.salePrice) ||
                                        formatCurrency(item.price)}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    Tổng: {formatCurrency(totalPrice)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
