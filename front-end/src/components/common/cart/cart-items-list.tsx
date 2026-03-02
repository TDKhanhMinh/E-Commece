import { CartItemResponse } from "@/type/cart-type";
import { CartItemCard } from "./cart-item-card";

interface CartItemsListProps {
    items: CartItemResponse[];
    onUpdateQuantity: (
        skuId: number,
        currentQuantity: number,
        delta: number,
        maxStock: number
    ) => void;
    onRemove: (skuId: number, productName: string) => void;
    isUpdating: boolean;
    isRemoving: boolean;
    checkedItems?: number[];
    onToggleSelected?: (skuId: number, checked: boolean) => void;
}

export function CartItemsList({
    items,
    onUpdateQuantity,
    onRemove,
    isUpdating,
    isRemoving,
    checkedItems,
    onToggleSelected,
}: CartItemsListProps) {
    return (
        <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
                <CartItemCard
                    key={item.id}
                    item={item}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemove={onRemove}
                    isUpdating={isUpdating}
                    isRemoving={isRemoving}
                />
            ))}
        </div>
    );
}
