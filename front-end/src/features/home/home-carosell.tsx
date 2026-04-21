"use client";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import SimpleBar from "simplebar-react";
import { useRouter } from "@/i18n/routing";
import { MOCK_CAROUSEL_ITEMS } from "../../../mock";
import { useTranslations } from "next-intl";

export default function HomeCarousel() {
    const t = useTranslations("home.carousel");
    const router = useRouter();
    return (
        <section className="bg-zinc-50 py-12 sm:py-16 lg:py-24 dark:bg-zinc-900/50">
            <div className="container mx-auto px-4">
                <div className="mx-auto mb-10 max-w-3xl text-center text-slate-900 sm:mb-16 dark:text-slate-100">
                    <span className="mb-4 block bg-gradient-to-r from-orange-500 via-indigo-500 to-green-500 bg-clip-text text-sm font-bold tracking-widest text-transparent uppercase sm:text-base lg:mb-6">
                        {t("badge")}
                    </span>
                    <h2 className="text-3xl font-bold uppercase tracking-tight sm:text-4xl md:text-5xl">
                        {t("title")}
                    </h2>
                </div>

                <div className="relative">
                    <SimpleBar autoHide={true} className="w-full">
                        <div className="flex gap-4 px-4 pb-8 sm:gap-6 lg:gap-8">
                            {MOCK_CAROUSEL_ITEMS.map((item) => (
                                <Card
                                    key={item.label}
                                    onClick={() =>
                                        router.push("/collection/" + item.label)
                                    }
                                    className="group relative flex w-[260px] shrink-0 cursor-pointer flex-col items-center gap-6 overflow-hidden border-none p-6 shadow-xl transition-all duration-300 hover:-translate-y-2 sm:w-[300px] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] dark:bg-zinc-900/80 dark:shadow-slate-950/40"
                                >
                                    {/* Badge decor */}
                                    <div className="absolute top-0 right-0 h-24 w-24 translate-x-12 -translate-y-12 rounded-full bg-primary/10 blur-2xl transition-all group-hover:bg-primary/20" />
                                    
                                    <Label className="z-10 rounded-full bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 px-4 py-1.5 text-xs font-bold text-white uppercase sm:text-sm">
                                        {item.label}
                                    </Label>

                                    <div className="z-10 text-center text-lg font-extrabold tracking-tight sm:text-xl lg:text-2xl">
                                        {t(`items.${item.label}`)}
                                    </div>

                                    <div className="relative z-10 aspect-square w-32 transition-transform duration-500 group-hover:scale-110 sm:w-40 lg:w-48">
                                        <Image
                                            src={item.imgUrl}
                                            alt={item.label}
                                            fill
                                            className="object-contain"
                                            sizes="(max-width: 640px) 128px, (max-width: 1024px) 160px, 192px"
                                        />
                                    </div>
                                    
                                    <div className="mt-2 text-xs font-medium text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 dark:text-zinc-500">
                                        {t("view_more") || "Khám phá ngay →"}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </SimpleBar>
                </div>
            </div>
        </section>

    );
}

