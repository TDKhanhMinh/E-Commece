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
    ShieldCheck,
    Eye,
    Database,
    Share2,
    Mail,
    Lock,
    UserCheck,
    RefreshCcw,
    ChevronRight,
    Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations, useLocale } from "next-intl";
import { fDateTime } from "@/lib/format-date-time";

const DATA_COLLECTION_KEYS = [
    {
        key: "personal",
        color: "bg-blue-50 text-blue-600",
    },
    {
        key: "delivery",
        color: "bg-emerald-50 text-emerald-600",
    },
    {
        key: "system",
        color: "bg-purple-50 text-purple-600",
    },
];

const USAGE_INFO_KEYS = [
    {
        key: "transaction",
        icon: RefreshCcw,
        gradient: "from-blue-500 to-cyan-400",
    },
    {
        key: "notification",
        icon: Mail,
        gradient: "from-purple-500 to-indigo-400",
    },
];

export default function PrivacyPolicy() {
    const t = useTranslations("user.privacy");
    const locale = useLocale();
    const lastUpdated = fDateTime("2026-01-21", "dd/MM/yyyy");

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 dark:bg-slate-950">
            {/* HERO SECTION - GRADIENT MẠNH MẼ */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4 py-16 sm:py-24">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="relative z-10 container mx-auto max-w-4xl space-y-6 text-center">
                    <Badge className="border border-indigo-500/30 bg-indigo-500/20 px-4 py-1 text-indigo-200 backdrop-blur-md hover:bg-indigo-500/30">
                        <Sparkles className="mr-2 inline size-3" /> {t("badge")}
                    </Badge>
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl leading-tight font-black tracking-tight text-white">
                        {t.rich("title", {
                            blue: (chunks) => (
                                <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent italic">
                                    {chunks}
                                </span>
                            ),
                        })}
                    </h1>
                    <p className="mx-auto max-w-2xl text-base sm:text-lg font-medium text-slate-300 lg:text-xl leading-relaxed">
                        {t("description")}
                    </p>
                    <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold tracking-wider text-slate-400 uppercase">
                        <Lock className="size-3 sm:size-4 text-emerald-400" />{" "}
                        {t("lastUpdated", { date: lastUpdated })}
                    </div>
                </div>

                {/* TRANG TRÍ */}
                <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-[100px]"></div>
                <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-[100px]"></div>
            </div>

            <div className="relative z-20 container mx-auto -mt-10 sm:-mt-16 max-w-5xl px-4">
                <Card className="overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] border-none bg-white/90 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/90">
                    <CardContent className="p-0">
                        <ScrollArea className="h-auto md:h-[800px] w-full">
                            <div className="space-y-12 sm:space-y-16 p-5 sm:p-10 md:p-16">
                                {/* 1. DANH MỤC DỮ LIỆU */}
                                <section className="space-y-8">
                                    <div className="flex items-center gap-4 border-l-4 border-blue-500 pl-4 sm:pl-6">
                                        <div className="rounded-2xl bg-blue-100 p-2 sm:p-3 text-blue-600 shadow-inner dark:bg-blue-900/30 dark:text-blue-400">
                                            <Database className="size-6 sm:size-7" />
                                        </div>
                                        <h2 className="text-xl sm:text-3xl font-black tracking-tight text-slate-800 uppercase dark:text-slate-100">
                                            {t("sections.dataCollection.title")}
                                        </h2>
                                    </div>
                                    <div className="overflow-x-auto rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                        <Table className="min-w-[700px]">
                                            <TableHeader className="bg-slate-50/50 dark:bg-slate-950/50">
                                                <TableRow className="hover:bg-transparent dark:border-slate-800">
                                                    <TableHead className="h-14 font-bold text-slate-800 dark:text-slate-200">
                                                        {t(
                                                            "sections.dataCollection.table.type"
                                                        )}
                                                    </TableHead>
                                                    <TableHead className="h-14 font-bold text-slate-800 dark:text-slate-200">
                                                        {t(
                                                            "sections.dataCollection.table.example"
                                                        )}
                                                    </TableHead>
                                                    <TableHead className="h-14 pr-8 text-right font-bold text-slate-800 dark:text-slate-200">
                                                        {t(
                                                            "sections.dataCollection.table.purpose"
                                                        )}
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {DATA_COLLECTION_KEYS.map(
                                                    (item, index) => (
                                                        <TableRow
                                                            key={index}
                                                            className="h-16 border-slate-50 transition-colors hover:bg-slate-50/50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                                                        >
                                                            <TableCell className="font-bold">
                                                                <span
                                                                    className={`rounded-xl px-4 py-1.5 text-xs tracking-wider uppercase ${item.color} dark:bg-opacity-20`}
                                                                >
                                                                    {t(
                                                                        `sections.dataCollection.table.items.${item.key}.type`
                                                                    )}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="font-medium text-slate-700 dark:text-slate-300">
                                                                {t(
                                                                    `sections.dataCollection.table.items.${item.key}.example`
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="pr-8 text-right text-sm text-slate-500 italic dark:text-slate-500">
                                                                {t(
                                                                    `sections.dataCollection.table.items.${item.key}.purpose`
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </section>

                                {/* 2. MỤC ĐÍCH SỬ DỤNG */}
                                <section className="space-y-8">
                                    <div className="flex items-center gap-4 border-l-4 border-purple-500 pl-4 sm:pl-6">
                                        <div className="rounded-2xl bg-purple-100 p-2 sm:p-3 text-purple-600 shadow-inner dark:bg-purple-900/30 dark:text-purple-400">
                                            <Eye className="size-6 sm:size-7" />
                                        </div>
                                        <h2 className="text-xl sm:text-3xl font-black tracking-tight text-slate-800 uppercase dark:text-slate-100">
                                            {t("sections.usage.title")}
                                        </h2>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
                                        {USAGE_INFO_KEYS.map((item, index) => (
                                            <div
                                                key={index}
                                                className="group relative rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 bg-white p-6 sm:p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-800 dark:hover:shadow-indigo-950/50"
                                            >
                                                <div
                                                    className={`absolute top-0 left-0 h-full w-2 rounded-l-[1.5rem] sm:rounded-l-[2rem] bg-gradient-to-b ${item.gradient}`}
                                                ></div>
                                                <div className="flex items-start gap-5">
                                                    <div
                                                        className={`rounded-2xl bg-gradient-to-br p-4 ${item.gradient} text-white shadow-lg transition-transform group-hover:scale-110`}
                                                    >
                                                        <item.icon className="size-6" />
                                                    </div>
                                                    <div>
                                                        <h4 className="mb-2 text-xl font-black text-slate-900 italic dark:text-slate-100">
                                                            {t(
                                                                `sections.usage.items.${item.key}.title`
                                                            )}
                                                        </h4>
                                                        <p className="text-sm leading-relaxed font-medium text-slate-500 dark:text-slate-400">
                                                            {t(
                                                                `sections.usage.items.${item.key}.content`
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* 3. CHIA SẺ BÊN THỨ 3 */}
                                <section className="space-y-8">
                                    <div className="flex items-center gap-4 border-l-4 border-emerald-500 pl-4 sm:pl-6">
                                        <div className="rounded-2xl bg-emerald-100 p-2 sm:p-3 text-emerald-600 shadow-inner dark:bg-emerald-900/30 dark:text-emerald-400">
                                            <Share2 className="size-6 sm:size-7" />
                                        </div>
                                        <h2 className="text-xl sm:text-3xl font-black tracking-tight text-slate-800 uppercase dark:text-slate-100">
                                            {t("sections.sharing.title")}
                                        </h2>
                                    </div>
                                    <div className="flex flex-col items-center gap-6 sm:gap-8 rounded-[1.5rem] sm:rounded-[2.5rem] border border-emerald-100 bg-emerald-50/50 p-6 sm:p-10 md:flex-row dark:border-emerald-900/30 dark:bg-emerald-950/20">
                                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white shadow-xl shadow-emerald-200 dark:bg-slate-800 dark:shadow-emerald-950/50">
                                            <ShieldCheck className="h-10 w-10 text-emerald-600 dark:text-emerald-500" />
                                        </div>
                                        <div className="space-y-3 text-center md:text-left">
                                            <h4 className="text-xl font-black text-emerald-900 uppercase dark:text-emerald-400">
                                                {t(
                                                    "sections.sharing.commitment"
                                                )}
                                            </h4>
                                            <p className="leading-relaxed font-medium text-slate-700 dark:text-slate-300">
                                                {t("sections.sharing.content")}
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* QUYỀN LỢI NGƯỜI DÙNG */}
                                <section className="group relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-slate-900 p-6 sm:p-10 text-white">
                                    <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-center">
                                        <div className="space-y-3">
                                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[10px] font-black tracking-[0.2em] text-cyan-400 uppercase">
                                                <UserCheck className="size-3" />{" "}
                                                {t("sections.rights.badge")}
                                            </div>
                                            <h3 className="text-2xl sm:text-3xl font-black tracking-tight uppercase italic">
                                                {t("sections.rights.title")}
                                            </h3>
                                            <p className="max-w-lg font-medium text-slate-400 dark:text-slate-300">
                                                {t.rich(
                                                    "sections.rights.description",
                                                    {
                                                        strong: (chunks) => (
                                                            <strong>
                                                                {chunks}
                                                            </strong>
                                                        ),
                                                    }
                                                )}
                                            </p>
                                        </div>
                                        <button className="group/btn flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-sm font-black text-slate-900 shadow-2xl transition-all hover:bg-cyan-400 hover:text-white active:scale-95">
                                            {t("sections.rights.button")}{" "}
                                            <ChevronRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
                                        </button>
                                    </div>
                                    {/* ÁNH SÁNG NỀN */}
                                    <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-[80px] transition-all duration-700 group-hover:bg-cyan-500/30"></div>
                                </section>

                                {/* FOOTER */}
                                <footer className="flex flex-col items-center gap-6 border-t border-slate-100 pt-16 dark:border-slate-800">
                                    <p className="text-xs font-black tracking-[0.3em] text-slate-400 uppercase dark:text-slate-600">
                                        {t("sections.footer.question")}
                                    </p>
                                    <a
                                        href={`mailto:${t(
                                            "sections.footer.email"
                                        )}`}
                                        className="group inline-flex items-center gap-4 rounded-2xl bg-slate-900 px-10 py-5 text-white shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                                    >
                                        <Mail className="size-5 transition-transform group-hover:scale-125" />
                                        <span className="text-sm font-black tracking-wider uppercase">
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
