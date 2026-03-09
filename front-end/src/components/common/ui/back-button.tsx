"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export function BackButton() {
    const router = useRouter();

    return (
        <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-primary mb-4 flex w-fit cursor-pointer items-center gap-1 pl-0 transition-colors"
        >
            <ChevronLeft className="h-5 w-5" />
            Quay lại trang trước
        </Button>
    );
}
