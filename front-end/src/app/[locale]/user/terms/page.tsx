"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    FileText,
    ShieldCheck,
    UserCircle,
    Coins,
    Lock,
    RefreshCcw,
    HelpCircle,
    CheckCircle2,
    ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations, useLocale } from "next-intl";
import { fDateTime } from "@/lib/format-date-time";

const TERMS_SECTIONS = [
    {
        id: 1,
        key: "acceptance",
        icon: CheckCircle2,
        gradient: "from-blue-500 to-cyan-400",
    },
    {
        id: 2,
        key: "account",
        icon: UserCircle,
        gradient: "from-indigo-500 to-purple-400",
    },
    {
        id: 3,
        key: "points",
        icon: Coins,
        gradient: "from-amber-500 to-orange-400",
    },
    {
        id: 4,
        key: "privacy",
        icon: Lock,
        gradient: "from-emerald-500 to-teal-400",
    },
    {
        id: 5,
        key: "changes",
        icon: RefreshCcw,
        gradient: "from-rose-500 to-pink-400",
    },
];

export default function TermsAndConditions() {
    const t = useTranslations("user.terms");
    const locale = useLocale();
    const lastUpdated = fDateTime("2026-01-21", "dd/MM/yyyy");

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 dark:bg-slate-950">
            {/* HERO SECTION - TIÊU ĐỀ RỰC RỠ */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-900 px-4 py-16 sm:py-24">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="relative z-10 container mx-auto max-w-4xl space-y-6 text-center">
                    <Badge className="border border-white/20 bg-white/10 px-6 py-1.5 text-indigo-100 backdrop-blur-xl hover:bg-white/20">
                        {t("badge")}
                    </Badge>
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-white uppercase leading-tight">
                        {t.rich("title", {
                            blue: (chunks) => (
                                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                    {chunks}
                                </span>
                            ),
                        })}
                    </h1>
                    <p className="mx-auto max-w-2xl text-base sm:text-lg font-medium text-slate-300 lg:text-xl leading-relaxed">
                        {t("description")}
                    </p>
                    <div className="flex items-center justify-center gap-3 text-sm font-semibold tracking-wider text-slate-400 uppercase">
                        <FileText className="size-4 text-cyan-400" />{" "}
                        {t("lastUpdated", { date: lastUpdated })}
                    </div>
                </div>

                {/* DECORATIVE LIGHTS */}
                <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-500/20 blur-[120px]"></div>
                <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-purple-500/20 blur-[120px]"></div>
            </div>

            <div className="relative z-20 container mx-auto -mt-10 sm:-mt-16 max-w-5xl px-4">
                <Card className="overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border-none bg-white/90 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/90">
                    <CardContent className="p-0">
                        <ScrollArea className="h-auto md:h-[800px] w-full">
                            <div className="space-y-12 p-5 sm:p-10 md:p-16">
                                <div className="grid grid-cols-1 gap-8">
                                    {TERMS_SECTIONS.map((section) => (
                                        <section
                                            key={section.id}
                                            className="group relative rounded-[1.25rem] sm:rounded-[1.5rem] border border-slate-100 bg-white p-5 sm:p-8 transition-all duration-500 hover:border-transparent hover:shadow-2xl hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-800 dark:hover:shadow-indigo-950/50"
                                        >
                                            <div
                                                className={`absolute top-0 left-0 h-full w-2 rounded-l-[1.25rem] sm:rounded-l-[1.5rem] bg-gradient-to-b ${section.gradient}`}
                                            ></div>

                                            <div className="flex flex-col items-start gap-4 sm:gap-6 md:flex-row">
                                                <div
                                                    className={`h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 rounded-2xl bg-gradient-to-br ${section.gradient} flex items-center justify-center text-white shadow-lg shadow-indigo-200 transition-transform duration-500 group-hover:scale-110`}
                                                >
                                                    <section.icon className="size-6 sm:size-7" />
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs font-black tracking-widest text-slate-300 uppercase dark:text-slate-500">
                                                            {t("sections.acceptance.title") ===
                                                            "Acceptance of Terms"
                                                                ? `Section ${section.id}`
                                                                : `Mục ${section.id}`}
                                                        </span>
                                                        <h3 className="text-xl sm:text-2xl leading-none font-extrabold text-slate-800 dark:text-slate-100">
                                                            {t(
                                                                `sections.${section.key}.title`
                                                            )}
                                                        </h3>
                                                    </div>
                                                    <p className="leading-relaxed font-medium text-slate-600 dark:text-slate-400">
                                                        {t(
                                                            `sections.${section.key}.content`
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </section>
                                    ))}
                                </div>

                                <div className="mt-12 sm:mt-16 border-t border-slate-100 pt-8 sm:pt-10 dark:border-slate-800">
                                    <div className="flex flex-col items-center justify-between gap-6 sm:gap-8 rounded-[1.5rem] sm:rounded-3xl bg-gradient-to-r from-slate-50 to-indigo-50/30 p-6 sm:p-8 md:flex-row dark:from-slate-800 dark:to-indigo-950/30">
                                        <div className="space-y-2 text-center md:text-left">
                                            <h4 className="flex items-center justify-center gap-2 text-xl font-bold text-slate-900 md:justify-start dark:text-slate-100">
                                                <HelpCircle className="size-6 text-indigo-500" />
                                                {t("support.title")}
                                            </h4>
                                            <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
                                                {t("support.description")}
                                            </p>
                                        </div>
                                        <button className="group flex items-center gap-2 rounded-2xl bg-slate-900 px-8 py-4 text-sm font-bold text-white shadow-xl transition-all duration-300 hover:bg-indigo-600 active:scale-95 dark:bg-indigo-600 dark:hover:bg-indigo-700">
                                            {t("support.button")}
                                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                        </button>
                                    </div>

                                    <div className="mt-8 sm:mt-12 flex justify-center gap-6 sm:gap-8 opacity-20 dark:opacity-40">
                                        <ShieldCheck className="size-12 sm:size-16 text-slate-900 dark:text-slate-100" />
                                        <FileText className="size-12 sm:size-16 text-slate-900 dark:text-slate-100" />
                                    </div>
                                    <p className="mt-8 text-center text-[10px] tracking-[0.2em] text-slate-400 uppercase dark:text-slate-600">
                                        {t("footer.copyright")}
                                    </p>
                                </div>
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
