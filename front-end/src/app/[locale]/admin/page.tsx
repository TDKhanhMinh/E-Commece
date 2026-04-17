"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ArrowUpRight,
    Package,
    ShieldCheck,
    ShoppingCart,
    Users,
} from "lucide-react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function AdminWelcomePage() {
    const t = useTranslations("admin");
    const locale = useLocale();

    // Tự động lấy ngày hiện tại để lời chào tự nhiên hơn
    const today = new Date().toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const stats = [
        {
            title: t("stats.users"),
            value: "1,245",
            description: t("stats.usersDescription"),
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-600/10",
        },
        {
            title: t("stats.orders"),
            value: "356",
            description: t("stats.ordersDescription"),
            icon: ShoppingCart,
            color: "text-orange-600",
            bgColor: "bg-orange-600/10",
        },
        {
            title: t("stats.products"),
            value: "87",
            description: t("stats.productsDescription"),
            icon: Package,
            color: "text-emerald-600",
            bgColor: "bg-emerald-600/10",
        },
        {
            title: t("stats.security"),
            value: t("stats.securityValue"),
            description: t("stats.securityDescription"),
            icon: ShieldCheck,
            color: "text-purple-600",
            bgColor: "bg-purple-600/10",
        },
    ];

    const quickActions = [
        { name: t("actions.manageUsers"), href: "/admin/users" },
        { name: t("actions.manageOrders"), href: "/admin/orders" },
        { name: t("actions.manageProducts"), href: "/admin/products" },
        { name: t("actions.systemSettings"), href: "/admin/settings" },
    ];

    return (
        <div className="mx-auto w-full space-y-12 p-6 md:p-10">
            {/* Header / Greeting */}
            <div className="flex flex-col gap-2">
                <h1 className="text-foreground text-3xl font-semibold tracking-tight">
                    {t("welcome")}
                </h1>
                <p className="text-muted-foreground text-sm font-medium">
                    {today} • {t("overview")}
                </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card
                            key={index}
                            className="border-border/50 bg-card/50 hover:bg-card shadow-sm transition-all hover:shadow-md"
                        >
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-muted-foreground text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-md ${stat.bgColor}`}
                                >
                                    <Icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-semibold tracking-tight">
                                    {stat.value}
                                </div>
                                <p className="text-muted-foreground mt-1 text-xs">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Quick Actions - Minimalist style */}
            <div className="space-y-4">
                <h2 className="text-lg font-medium tracking-tight">
                    {t("quickAccess")}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {quickActions.map((action, index) => (
                        <Link
                            key={index}
                            href={action.href}
                            className="group border-border/50 hover:bg-muted/50 flex items-center justify-between rounded-lg border bg-transparent p-4 transition-colors"
                        >
                            <span className="text-sm font-medium">
                                {action.name}
                            </span>
                            <ArrowUpRight className="text-muted-foreground group-hover:text-foreground h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
