"use client";

import Image from "next/image";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { useTranslations } from "next-intl";

export function Subscribe() {
    const t = useTranslations("home.subscribe");

    return (
        <>
            <section className="px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
                <div className="container mx-auto">
                    <div className="relative grid grid-cols-1 items-center gap-8 overflow-hidden rounded-3xl bg-linear-to-r from-[#F2D65C] via-[#A9C97D] to-[#5BC5A7] p-8 sm:p-12 md:grid-cols-2 lg:p-16 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950">
                        {/* Text Content */}
                        <div className="relative z-10 flex flex-col text-start">
                            <h2 className="mb-4 text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl dark:text-slate-100">
                                {t("title")}
                            </h2>
                            <p className="mb-8 text-sm text-slate-700 sm:text-base lg:text-lg dark:text-slate-400">
                                {t("description")}
                            </p>
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                <Input
                                    placeholder={t("placeholder")}
                                    className="h-12 flex-1 rounded-xl bg-white/90 text-slate-900 border-none ring-offset-transparent focus-visible:ring-success dark:bg-zinc-800 dark:text-slate-100"
                                />
                                <Button className="h-12 bg-success-darker hover:bg-success text-secondary-light px-8 cursor-pointer rounded-xl font-semibold transition-all sm:w-auto dark:bg-success-dark dark:hover:bg-success-main">
                                    {t("button")}
                                </Button>
                            </div>
                        </div>

                        {/* Image - Dynamic visibility */}
                        <div className="relative hidden aspect-square w-full max-w-[320px] justify-self-center md:block lg:max-w-[400px]">
                            <Image
                                src="https://www.plug.tech/cdn/shop/files/Graphics_for_Bento_Grids_af74e2b3-20b7-45d1-ae40-cfad822ee80e.webp?v=1749093914&width=1200"
                                alt="Subscribe Image"
                                fill
                                className="rounded-3xl object-contain drop-shadow-2xl"
                                sizes="(max-width: 768px) 0vw, (max-width: 1024px) 320px, 400px"
                            />
                        </div>

                        {/* Background Decoration (Optional - added subtle glow) */}
                        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
                    </div>
                </div>
            </section>
        </>
    );
}

