"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Search,
    Mail,
    Phone,
    Facebook,
    MessageCircle,
    HelpCircle,
    ShieldQuestion,
    UserCheck,
    ChevronRight,
    Sparkles,
    HeadphonesIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store/useAuthStore";

export default function HelpCenter() {
    const t = useTranslations("user.support");
    const { user } = useAuthStore();
    const userName = user?.name || t("guest");

    const HELP_SECTIONS = [
        {
            title: t("sections.about.title"),
            icon: UserCheck,
            color: "bg-blue-500",
            questions: [
                t("sections.about.questions.0"),
                t("sections.about.questions.1"),
            ],
        },
        {
            title: t("sections.policy.title"),
            icon: ShieldQuestion,
            color: "bg-purple-500",
            questions: [
                t("sections.policy.questions.0"),
                t("sections.policy.questions.1"),
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 dark:bg-slate-950">
            {/* HERO SECTION - GRADIENT RỰC RỠ */}
            <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 px-4 pt-24 pb-32">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="relative z-10 container mx-auto max-w-4xl space-y-8 text-center">
                    <div className="flex justify-center">
                        <Badge className="animate-pulse border-none bg-white/20 px-6 py-1.5 text-white backdrop-blur-xl hover:bg-white/30">
                            <Sparkles className="mr-2 size-3" /> {t("badge")}
                        </Badge>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
                            {t.rich("hello", {
                                userName: userName,
                                nameTag: (chunks) => (
                                    <span className="text-yellow-300">
                                        {chunks}
                                    </span>
                                ),
                            })}
                        </h1>
                        <p className="mx-auto max-w-xl text-lg font-medium text-emerald-50 opacity-90 md:text-xl">
                            {t("hero.description")}
                        </p>
                    </div>

                    <div className="group relative mx-auto max-w-2xl">
                        <Input
                            className="h-16 w-full rounded-2xl border-none bg-white/95 pr-14 pl-8 text-lg text-slate-800 shadow-2xl shadow-emerald-900/20 backdrop-blur-md transition-all placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-yellow-400 dark:bg-slate-900/95 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus-visible:ring-yellow-300"
                            placeholder={t("search.placeholder")}
                        />
                        <div className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer rounded-xl bg-green-600 p-2.5 text-white shadow-lg transition-transform group-hover:scale-110">
                            <Search className="size-6" />
                        </div>
                    </div>
                </div>

                {/* DECORATIVE ELEMENTS */}
                <div className="absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-[100px]"></div>
                <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/4 translate-y-1/2 rounded-full bg-emerald-400/20 blur-[80px]"></div>
            </div>

            <div className="relative z-20 container mx-auto -mt-16 max-w-6xl px-4">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* LEFT COLUMN: FAQ SECTIONS */}
                    <div className="space-y-8 lg:col-span-2">
                        {HELP_SECTIONS.map((section, idx) => (
                            <Card
                                key={idx}
                                className="group overflow-hidden rounded-[2rem] border-none bg-white/80 shadow-xl shadow-slate-200/50 backdrop-blur-sm transition-all hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-slate-950/50"
                            >
                                <CardContent className="space-y-6 p-8">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`rounded-2xl p-3 ${section.color} text-white shadow-lg shadow-inherit`}
                                        >
                                            <section.icon className="size-6" />
                                        </div>
                                        <h3 className="text-2xl font-black tracking-wider text-slate-800 uppercase italic dark:text-slate-100">
                                            {section.title}
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        {section.questions.map((q, qIdx) => (
                                            <div
                                                key={qIdx}
                                                className="group/item flex cursor-pointer items-center justify-between rounded-2xl border border-transparent bg-slate-50 p-5 transition-all duration-300 hover:border-green-200 hover:bg-white hover:shadow-md dark:border-slate-800/50 dark:bg-slate-800/50 dark:hover:border-green-900/50 dark:hover:bg-slate-800"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="size-2 rounded-full bg-green-500 opacity-0 transition-opacity group-hover/item:opacity-100"></div>
                                                    <span className="text-[15px] font-semibold text-slate-700 group-hover/item:text-green-600 dark:text-slate-300 dark:group-hover/item:text-green-400">
                                                        {q}
                                                    </span>
                                                </div>
                                                <ChevronRight className="size-4 text-slate-300 transition-all group-hover/item:translate-x-1 group-hover/item:text-green-500" />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* RIGHT COLUMN: CONTACT & SUPPORT */}
                    <div className="space-y-6 lg:col-span-1">
                        <Card className="group relative overflow-hidden rounded-[2rem] border-none bg-slate-900 p-8 text-white shadow-xl">
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-green-500 p-2">
                                        <HeadphonesIcon className="size-5" />
                                    </div>
                                    <h3 className="text-xl font-bold">
                                        {t("quickConnect.title")}
                                    </h3>
                                </div>

                                <div className="space-y-4">
                                    <a
                                        href="mailto:customerservice@t7m.kmgroup.com"
                                        className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
                                    >
                                        <Mail className="size-5 text-blue-400" />
                                        <span className="truncate text-sm font-medium">
                                            customerservice@t7m.kmgroup.com
                                        </span>
                                    </a>
                                    <a
                                        href="tel:1900234518"
                                        className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
                                    >
                                        <Phone className="size-5 text-green-400" />
                                        <span className="text-sm font-medium">
                                            1900 2345 18 (Ext.01)
                                        </span>
                                    </a>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <a
                                        href="https://m.me/t7mshop"
                                        target="_blank"
                                        className="flex flex-col items-center gap-3 rounded-2xl border border-blue-500/30 bg-blue-600/20 p-4 transition-all hover:bg-blue-600/30"
                                    >
                                        <Facebook className="size-6 text-blue-500" />
                                        <span className="text-[10px] font-bold tracking-widest uppercase">
                                            Messenger
                                        </span>
                                    </a>
                                    <a
                                        href="https://zalo.me/3547667082335355338"
                                        target="_blank"
                                        className="flex flex-col items-center gap-3 rounded-2xl border border-cyan-500/30 bg-cyan-600/20 p-4 transition-all hover:bg-cyan-600/30"
                                    >
                                        <MessageCircle className="size-6 text-cyan-400" />
                                        <span className="text-[10px] font-bold tracking-widest uppercase">
                                            Zalo OA
                                        </span>
                                    </a>
                                </div>
                            </div>
                            <div className="absolute -right-8 -bottom-8 size-32 rounded-full bg-green-500/10 blur-2xl transition-transform duration-700 group-hover:scale-150"></div>
                        </Card>

                        <div className="rounded-[2rem] bg-gradient-to-br from-yellow-400 to-orange-500 p-8 text-white shadow-lg shadow-orange-200">
                            <HelpCircle className="mb-4 size-10 opacity-50" />
                            <h4 className="mb-2 text-xl leading-tight font-black italic">
                                {t("directConsult.title")}
                            </h4>
                            <p className="mb-4 text-sm font-medium opacity-90">
                                {t("directConsult.description")}
                            </p>
                            <button className="w-full rounded-xl bg-white py-3 font-bold text-orange-600 shadow-xl shadow-orange-900/20 transition-all hover:bg-slate-900 hover:text-white">
                                {t("directConsult.button")}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-16 space-y-4 text-center">
                    <p className="text-xs font-bold tracking-[0.3em] text-slate-400 uppercase dark:text-slate-600">
                        {t("footer.copyright")}
                    </p>
                </div>
            </div>
        </div>
    );
}
