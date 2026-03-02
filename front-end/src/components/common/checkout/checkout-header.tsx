"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface CheckoutHeaderProps {
    onBack: () => void;
    disabled?: boolean;
}

export function CheckoutHeader({ onBack, disabled }: CheckoutHeaderProps) {
    return (
        <div className="mb-8 flex items-center gap-4">
            <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                disabled={disabled}
            >
                <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">Xác nhận đơn hàng</h1>
        </div>
    );
}
