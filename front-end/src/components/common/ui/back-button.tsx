"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";

interface BackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
}

export function BackButton({ className, ...props }: BackButtonProps) {
    const router = useRouter();
    const t = useTranslations("common.navigation");

    return (
        <Button
            variant="ghost"
            onClick={() => router.back()}
            className={`text-muted-foreground hover:text-primary mb-4 flex w-fit cursor-pointer items-center gap-1 pl-0 transition-colors ${className || ""}`}
            {...props}
        >
            <ChevronLeft className="h-5 w-5" />
            {t("back")}
        </Button>
    );
}
