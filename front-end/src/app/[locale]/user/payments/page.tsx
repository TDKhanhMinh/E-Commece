"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ChevronRight,
    Database,
    Eye,
    Lock,
    Mail,
    RefreshCcw,
    Share2,
    ShieldCheck,
    UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

export default function PrivacyPolicy() {
    const t = useTranslations("user.privacy");
    const lastUpdated = "21/01/2026";

    const DATA_COLLECTION = [
        {
            type: t("sections.dataCollection.table.items.personal.type"),
            example: t("sections.dataCollection.table.items.personal.example"),
            purpose: t("sections.dataCollection.table.items.personal.purpose"),
            color: "bg-blue-50 text-blue-600",
        },
        {
            type: t("sections.dataCollection.table.items.delivery.type"),
            example: t("sections.dataCollection.table.items.delivery.example"),
            purpose: t("sections.dataCollection.table.items.delivery.purpose"),
            color: "bg-emerald-50 text-emerald-600",
        },
        {
            type: t("sections.dataCollection.table.items.system.type"),
            example: t("sections.dataCollection.table.items.system.example"),
            purpose: t("sections.dataCollection.table.items.system.purpose"),
            color: "bg-purple-50 text-purple-600",
        },
    ];

    const USAGE_INFO = [
        {
            title: t("sections.usage.items.transaction.title"),
            content: t("sections.usage.items.transaction.content"),
            icon: RefreshCcw,
            gradient: "from-blue-500 to-cyan-400",
        },
        {
            title: t("sections.usage.items.notification.title"),
            content: t("sections.usage.items.notification.content"),
            icon: Mail,
            gradient: "from-purple-500 to-indigo-400",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 dark:bg-slate-950">
            {/* HERO SECTION - TIÊU ĐỀ RỰC RỠ */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 px-4 py-20">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="relative z-10 container mx-auto max-w-4xl space-y-6 text-center">
                    <Badge className="border border-indigo-500/30 bg-indigo-500/20 px-4 py-1 text-indigo-200 backdrop-blur-md hover:bg-indigo-500/30">
                        {t("badge")}
                    </Badge>
                    <h1 
                        className="text-4xl font-extrabold tracking-tight text-white md:text-5xl"
                        dangerouslySetInnerHTML={{ __html: t.raw("title") }}
                    />
                    <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-300">
                        {t("description")}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-400 italic">
                        <Lock className="size-4" /> {t("lastUpdated", { date: lastUpdated })}
                    </div>
                </div>
            </div>

            <div className="relative z-20 container mx-auto -mt-12 max-w-5xl px-4">
                <Card className="border-none bg-white/80 shadow-2xl backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/80">
                    <CardContent className="p-0">
                        <ScrollArea className="h-[750px] w-full rounded-2xl">
                            <div className="space-y-16 p-8 md:p-12">
                                {/* 1. DỮ LIỆU THU THẬP */}
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                                        <div className="rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                            <Database className="size-6" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-800 italic dark:text-slate-100">
                                            {t("sections.dataCollection.title")}
                                        </h2>
                                    </div>
                                    <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm dark:border-slate-800">
                                        <Table>
                                            <TableHeader className="bg-slate-50/50 dark:bg-slate-950/50">
                                                <TableRow className="dark:border-slate-800">
                                                    <TableHead className="font-bold text-slate-700 dark:text-slate-300">
                                                        {t("sections.dataCollection.table.type")}
                                                    </TableHead>
                                                    <TableHead className="font-bold text-slate-700 dark:text-slate-300">
                                                        {t("sections.dataCollection.table.example")}
                                                    </TableHead>
                                                    <TableHead className="font-bold text-slate-700 dark:text-slate-300">
                                                        {t("sections.dataCollection.table.purpose")}
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {DATA_COLLECTION.map(
                                                    (item, index) => (
                                                        <TableRow
                                                            key={index}
                                                            className="transition-colors hover:bg-slate-50/30 dark:border-slate-800 dark:hover:bg-slate-800/50"
                                                        >
                                                            <TableCell className="font-semibold">
                                                                <span
                                                                    className={`rounded-full px-3 py-1 text-xs font-bold ${item.color}`}
                                                                >
                                                                    {item.type}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="font-medium text-slate-600 dark:text-slate-400">
                                                                {item.example}
                                                            </TableCell>
                                                            <TableCell className="text-sm text-slate-500 italic dark:text-slate-500">
                                                                {item.purpose}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </section>

                                {/* 2. CÁCH SỬ DỤNG THÔNG TIN */}
                                <section className="space-y-6">
                                    <div className="flex items-center gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
                                        <div className="rounded-lg bg-purple-100 p-2 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                                            <Eye className="size-6" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-800 italic dark:text-slate-100">
                                            {t("sections.usage.title")}
                                        </h2>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        {USAGE_INFO.map((item, index) => (
                                            <div
                                                key={index}
                                                className="group relative rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-800 dark:shadow-slate-950/50"
                                            >
                                                <div
                                                    className={`absolute top-0 left-0 h-full w-1 rounded-l-2xl bg-gradient-to-b ${item.gradient}`}
                                                ></div>
                                                <div className="flex items-start gap-4">
                                                    <div
                                                        className={`rounded-xl bg-gradient-to-br p-3 ${item.gradient} text-white shadow-lg`}
                                                    >
                                                        <item.icon className="size-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="mb-1 font-bold text-slate-900 dark:text-slate-100">
                                                            {item.title}
                                                        </h4>
                                                        <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                                            {item.content}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* 3. CHIA SẺ DỮ LIỆU */}
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                                        <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                            <Share2 className="size-6" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-800 italic dark:text-slate-100">
                                            {t("sections.sharing.title")}
                                        </h2>
                                    </div>
                                    <div className="flex items-start gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6 dark:border-emerald-900/30 dark:bg-emerald-950/20">
                                        <ShieldCheck className="mt-1 h-8 w-8 shrink-0 text-emerald-600 dark:text-emerald-500" />
                                        <p 
                                            className="text-sm leading-relaxed text-slate-700 md:text-base dark:text-slate-300"
                                            dangerouslySetInnerHTML={{ __html: t.raw("sections.sharing.content") }}
                                        />
                                    </div>
                                </section>

                                {/* 4. QUYỀN CỦA NGƯỜI DÙNG */}
                                <section className="group relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
                                    <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                                        <div className="space-y-2">
                                            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold tracking-widest text-white uppercase">
                                                <UserCheck className="size-3" />{" "}
                                                {t("sections.rights.badge")}
                                            </div>
                                            <h3 className="text-2xl font-bold">
                                                {t("sections.rights.title")}
                                            </h3>
                                            <p className="max-w-lg text-sm text-indigo-100">
                                                {t("sections.rights.description")}
                                            </p>
                                        </div>
                                        <button className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-indigo-600 shadow-lg transition-colors hover:bg-yellow-300">
                                            {t("sections.rights.button")}{" "}
                                            <ChevronRight className="size-4" />
                                        </button>
                                    </div>
                                    {/* DECORATIVE CIRCLE */}
                                    <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/10 blur-2xl transition-transform duration-700 group-hover:scale-125"></div>
                                </section>

                                {/* FOOTER */}
                                <footer className="space-y-6 border-t border-slate-100 pt-10 text-center dark:border-slate-800">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {t("sections.footer.question")}
                                    </p>
                                    <a
                                        href={`mailto:${t("sections.footer.email")}`}
                                        className="group inline-flex items-center gap-3 rounded-2xl bg-slate-900 px-8 py-4 text-white shadow-xl transition-all duration-300 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                                    >
                                        <Mail className="size-5 transition-transform group-hover:scale-110" />
                                        <span className="font-bold tracking-wide">
                                            {t("sections.footer.email")}
                                        </span>
                                    </a>
                                </footer>
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
