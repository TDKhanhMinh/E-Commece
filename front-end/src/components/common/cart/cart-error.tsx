import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";

interface CartErrorProps {
    onBack: () => void;
}

export function CartError({ onBack }: CartErrorProps) {
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
            <Card className="p-8 text-center">
                <p className="text-destructive text-lg">
                    Không thể tải giỏ hàng. Vui lòng thử lại sau.
                </p>
            </Card>
        </div>
    );
}
