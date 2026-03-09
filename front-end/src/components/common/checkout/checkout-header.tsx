"use client";
import { BackButton } from "@/components/common/ui/back-button";

export function CheckoutHeader() {
    return (
        <div className="mb-8 flex items-center gap-4">
            <BackButton />
            <h1 className="text-3xl font-bold">Xác nhận đơn hàng</h1>
        </div>
    );
}
