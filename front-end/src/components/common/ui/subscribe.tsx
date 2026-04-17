"use client";

import Image from "next/image";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { useTranslations } from "next-intl";

export function Subscribe() {
    const t = useTranslations("home.subscribe");

    return (
        <>
            <section className="mb-8 flex w-full items-center justify-center">
                <div className="container grid grid-cols-2 rounded-3xl bg-linear-to-r from-[#F2D65C] via-[#A9C97D] to-[#5BC5A7] p-10 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950">
                    <div className="container mx-auto flex flex-col px-6 text-start">
                        <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-slate-100">
                            {t("title")}
                        </h2>
                        <p className="text-slate-700 mb-8 dark:text-slate-400">
                            {t("description")}
                        </p>
                        <Input
                            placeholder={t("placeholder")}
                            className="mb-4 h-12 rounded-3xl bg-white text-slate-900 dark:bg-zinc-800 dark:text-slate-100"
                        />
                        <Button className="bg-success-darker hover:bg-success text-secondary-light max-w-36 cursor-pointer rounded-lg dark:bg-success-dark dark:hover:bg-success-main">
                            {t("button")}
                        </Button>
                    </div>
                    <div className="relative left-[50%] hidden w-64 md:block">
                        <Image
                            src="https://www.plug.tech/cdn/shop/files/Graphics_for_Bento_Grids_af74e2b3-20b7-45d1-ae40-cfad822ee80e.webp?v=1749093914&width=1200"
                            alt="Subscribe Image"
                            width={400}
                            height={400}
                            className="rounded-3xl object-cover"
                        />
                    </div>
                </div>
            </section>
        </>
    );
}

