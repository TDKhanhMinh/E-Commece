import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ShoppingCart } from "lucide-react";

interface CartEmptyProps {
    onBack: () => void;
    onContinueShopping: () => void;
}

export function CartEmpty({ onBack, onContinueShopping }: CartEmptyProps) {
    return (
        <div className="container mx-auto max-w-6xl px-4 py-8">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="text-muted-foreground hover:text-primary flex items-center gap-1 pl-0 transition-colors"
                >
                    <ChevronLeft className="h-5 w-5" />
                    Quay lại trang trước
                </Button>
            </div>
            <Card className="p-12 text-center">
                <ShoppingCart className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                <h2 className="mb-2 text-2xl font-bold">Giỏ hàng trống</h2>
                <p className="text-muted-foreground mb-6">
                    Bạn chưa có sản phẩm nào trong giỏ hàng
                </p>
                <Button onClick={onContinueShopping}>Tiếp tục mua sắm</Button>
            </Card>
        </div>
    );
}
