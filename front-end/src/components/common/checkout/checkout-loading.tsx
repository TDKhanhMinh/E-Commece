"use client";
import { Loader2 } from "lucide-react";

export function CheckoutLoading() {
    return (
        <div className="container mx-auto flex min-h-100 items-center justify-center">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
    );
}
