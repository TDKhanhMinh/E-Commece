"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (isHydrated && !isAuthenticated) {
            router.push("/login");
        }
    }, [isHydrated, isAuthenticated, router]);

    if (!isHydrated) return <div>Đang tải...</div>;

    return isAuthenticated ? <>{children}</> : null;
}
