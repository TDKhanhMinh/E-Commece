import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItemResponse } from "@/type/cart-type";
import { formatCurrency } from "@/lib/format-price";
import { useTranslations } from "next-intl";

interface CartItemCardProps {
    item: CartItemResponse;
    isSelected: boolean;
    onSelect: (skuId: number, checked: boolean) => void;
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
    isSelected,
    onSelect,
    onUpdateQuantity,
    onRemove,
    isUpdating,
    isRemoving,
}: CartItemCardProps) {
    const t = useTranslations("cart.item");
    console.log("Rendering CartItemCard for SKU:", item);
    const totalPrice = item.salePrice
        ? item.salePrice * item.quantity
        : item.price * item.quantity;

    const outOfStock = item.quantity > item.stock;

    return (
        <Card className="bg-slate-50/50 dark:bg-slate-900/50 dark:shadow-slate-950/50 dark:border-slate-800 overflow-hidden border-none shadow-sm dark:border">
            <CardContent className="p-4">
                <div className="flex items-start gap-4">
                    <div className="flex shrink-0 items-start">
                        <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) =>
                                onSelect(item.skuId, checked as boolean)
                            }
                            disabled={outOfStock}
                        />
                    </div>

                    <div className="dark:bg-slate-800 dark:border-slate-700 h-24 w-24 shrink-0 rounded-lg border bg-white p-2">
                        <img
                            src={item.image || "/placeholder.png"}
                            alt={item.productName}
                            className="h-full w-full object-contain"
                        />
                    </div>

                    <div className="flex flex-1 flex-col justify-between self-stretch">
                        <div>
                            <div className="flex justify-between">
                                <div>
                                    <h3 className="dark:text-slate-100 text-lg font-semibold">
                                        {item.productName}
                                    </h3>
                                    <p className="dark:text-slate-500 text-muted-foreground text-xs">
                                        SKU: {item.skuCode}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-destructive dark:text-slate-500 dark:hover:text-red-400"
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
                                            className="text-muted-foreground dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 rounded border bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                                        >
                                            {key}: {value}
                                        </span>
                                    )
                                )}
                            </div>
                            {outOfStock && (
                                <p className="text-destructive dark:text-red-400 mt-2 text-sm">
                                    {t("outOfStock")}
                                </p>
                            )}
                        </div>

                        <div className="mt-4 flex items-end justify-between">
                            <div className="dark:bg-slate-800 dark:border-slate-700 flex items-center rounded-md border bg-white">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="dark:border-slate-700 dark:hover:bg-slate-700 h-8 w-8 rounded-none border-r"
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
                                    <Minus className="dark:text-slate-300 h-3 w-3" />
                                </Button>
                                <span className="dark:text-slate-100 w-10 text-center text-sm font-medium">
                                    {item.quantity}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="dark:border-slate-700 dark:hover:bg-slate-700 h-8 w-8 rounded-none border-l"
                                    onClick={() => {
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
                                    <Plus className="dark:text-slate-300 h-3 w-3" />
                                </Button>
                            </div>
                            <div className="text-right">
                                {item.discountPercent &&
                                    item.discountPercent > 0 && (
                                        <p className="dark:text-slate-500 text-muted-foreground mb-1 text-xs line-through">
                                            {formatCurrency(item.price)}
                                        </p>
                                    )}
                                <p className="text-primary dark:text-blue-400 text-lg font-bold">
                                    {formatCurrency(item.salePrice) ||
                                        formatCurrency(item.price)}
                                </p>
                                <p className="dark:text-slate-500 text-muted-foreground text-xs">
                                    {t("total", {
                                        price: formatCurrency(totalPrice),
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

