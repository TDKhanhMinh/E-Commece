"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Application Error:", error);
    }, [error]);
    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
            <div className="relative mb-6">
                <div className="bg-destructive absolute inset-0 animate-pulse opacity-20 blur-2xl"></div>
                <AlertCircle className="text-destructive relative mx-auto h-20 w-20" />
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Đã xảy ra sự cố!
            </h1>
            <p className="text-muted-foreground mt-4 max-w-125">
                Chúng tôi rất tiếc vì sự gián đoạn này. Một lỗi hệ thống đã xảy
                ra trong quá trình xử lý yêu cầu của bạn.
            </p>

            {error.digest && (
                <p className="text-muted-foreground/60 mt-2 font-mono text-xs">
                    Error ID: {error.digest}
                </p>
            )}

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button onClick={() => reset()} size="lg" className="gap-2">
                    <RefreshCcw className="h-4 w-4" />
                    Thử lại
                </Button>

                <Button asChild variant="outline" size="lg" className="gap-2">
                    <Link href="/">
                        <Home className="h-4 w-4" />
                        Về trang chủ
                    </Link>
                </Button>
            </div>
        </div>
    );
}
