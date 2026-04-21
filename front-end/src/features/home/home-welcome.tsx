"use client";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

function HomeWelcome() {
    const tWelcome = useTranslations("home.welcome");
    const tBundles = useTranslations("home.bundles");

    const welcomeItems = [
        { key: "quality" },
        { key: "guarantee" },
        { key: "inspection" },
    ];

    return (
        <>
            <div className="mt-8 mb-8 grid grid-cols-1 gap-8 px-4 md:mt-12 md:grid-cols-2 lg:gap-12">
                <div className="order-2 flex flex-col md:order-1">
                    <div className="relative aspect-video w-full overflow-hidden rounded-2xl md:aspect-auto md:h-full">
                        <Image
                            src="https://res.cloudinary.com/dqioktyk4/image/upload/v1768803309/ukwtm3fvsbkioxzybkfl.png"
                            alt="Hero Background"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
                <div className="order-1 flex flex-col text-start md:order-2">
                    <span className="mb-3 bg-gradient-to-r from-orange-500 via-indigo-500 to-green-500 bg-clip-text text-start text-lg font-bold tracking-tighter text-transparent uppercase sm:text-xl">
                        {tWelcome("badge")}
                    </span>
                    <h1 className="flex flex-col text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-slate-100">
                        <span>{tWelcome("title1")}</span>
                        <span>{tWelcome("title2")}</span>
                    </h1>
                    <p className="text-secondary-dark mt-4 mb-8 text-base md:text-lg dark:text-slate-400">
                        {tWelcome("description")}
                    </p>

                    <div className="flex flex-col gap-5 sm:gap-6">
                        {welcomeItems.map((item) => (
                            <div
                                key={item.key}
                                className="flex items-start gap-4"
                            >
                                <div className="bg-secondary shrink-0 rounded-full dark:bg-secondary-dark">
                                    <ShieldCheck className="h-10 w-10 p-2 text-white sm:h-12 sm:w-12" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-base font-semibold text-slate-900 sm:text-lg dark:text-slate-200">
                                        {tWelcome(`items.${item.key}.title`)}
                                    </span>
                                    <span className="text-secondary-dark mt-1 text-sm dark:text-slate-500">
                                        {tWelcome(
                                            `items.${item.key}.description`
                                        )}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 flex w-full items-center justify-start">
                        <Button className="bg-success-darker hover:bg-success h-12 w-full cursor-pointer rounded-2xl px-8 text-base font-bold text-white transition-all sm:w-auto sm:px-16 md:text-lg">
                            {tWelcome("learnMoreButton")}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mx-4 mt-20 mb-8 grid grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-2xl md:mt-32 md:grid-cols-2 dark:bg-zinc-900 dark:shadow-slate-950/50">
                <div className="flex flex-col p-6 text-start md:p-8 lg:p-12">
                    <span className="mb-3 bg-gradient-to-r from-orange-500 via-indigo-500 to-green-500 bg-clip-text text-start text-sm font-bold tracking-tighter text-transparent uppercase sm:text-base">
                        {tBundles("badge")}
                    </span>
                    <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl dark:text-slate-100">
                        {tBundles("title")}
                    </h2>
                    <div className="hidden h-12 md:block md:h-24 lg:h-32"> </div>
                    <p className="text-secondary-dark mt-4 text-sm leading-relaxed sm:text-base dark:text-slate-400">
                        {tBundles("description")}
                    </p>

                    <div className="mt-8 mb-4 flex w-full items-center justify-start">
                        <Button className="bg-success-darker hover:bg-success h-12 w-full cursor-pointer rounded-2xl px-8 text-base font-bold text-white transition-all sm:w-auto sm:px-20">
                            {tBundles("shopNowButton")}
                        </Button>
                    </div>
                </div>
                <div className="relative aspect-video w-full md:aspect-auto md:h-full">
                    <Image
                        src="https://www.plug.tech/cdn/shop/files/Untitled_design_-_2025-06-10T113805.791.webp?v=1749573696&width=1000"
                        alt="Bundles Background"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>

        </>
    );
}

export default HomeWelcome;
