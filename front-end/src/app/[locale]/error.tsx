"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

import { useTranslations } from "next-intl";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const t = useTranslations("error");
    useEffect(() => {
        console.error("Application Error:", error);
    }, [error]);
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center transition-colors duration-300">
            <div className="relative mb-6">
                <div className="bg-destructive/20 dark:bg-destructive/30 absolute inset-0 animate-pulse blur-2xl"></div>
                <AlertCircle className="text-destructive relative mx-auto h-20 w-20" />
            </div>

            <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl">
                {t("title")}
            </h1>
            <p className="text-muted-foreground mt-4 max-w-125">
                {t("description")}
            </p>

            {error.digest && (
                <p className="text-muted-foreground/60 mt-2 font-mono text-xs">
                    {t("idLabel")}: {error.digest}
                </p>
            )}

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button onClick={() => reset()} size="lg" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground dark:bg-destructive dark:hover:bg-destructive/80 gap-2 shadow-lg transition-all active:scale-95">
                    <RefreshCcw className="h-4 w-4" />
                    {t("retry")}
                </Button>

                <Button asChild variant="outline" size="lg" className="border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 gap-2 transition-all active:scale-95">
                    <Link href="/">
                        <Home className="h-4 w-4" />
                        {t("goHome")}
                    </Link>
                </Button>
            </div>
        </div>
    );
}
