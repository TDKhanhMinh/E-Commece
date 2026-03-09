import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { BackButton } from "@/components/common/ui/back-button";

interface CartEmptyProps {
    onContinueShopping: () => void;
}

export function CartEmpty({ onContinueShopping }: CartEmptyProps) {
    return (
        <div className="container mx-auto max-w-6xl px-4 py-8">
            <div className="mb-6">
                <BackButton />
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
