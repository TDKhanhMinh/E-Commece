import { Button } from "@/components/ui/button";
import { ChevronLeft, Trash2 } from "lucide-react";

interface CartHeaderProps {
    itemCount: number;
    onBack: () => void;
    onClearCart: () => void;
    isClearingCart: boolean;
    hasItems: boolean;
}

export function CartHeader({
    itemCount,
    onBack,
    onClearCart,
    isClearingCart,
    hasItems,
}: CartHeaderProps) {
    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="text-muted-foreground hover:text-primary flex items-center gap-1 pl-0 transition-colors"
                >
                    <ChevronLeft className="h-5 w-5" />
                    Quay lại trang trước
                </Button>
                {hasItems && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClearCart}
                        disabled={isClearingCart}
                        className="text-destructive hover:text-destructive"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {isClearingCart ? "Đang xóa..." : "Xóa tất cả"}
                    </Button>
                )}
            </div>

            <h1 className="mb-8 text-3xl font-bold">
                Giỏ hàng của bạn ({itemCount} sản phẩm)
            </h1>
        </>
    );
}
