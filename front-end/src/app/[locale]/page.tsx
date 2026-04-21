import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HomeCarousel from "@/features/home/home-carosell";
import HomeDeals from "@/features/home/home-deals";
import HomeFeedBack from "@/features/home/home-feedback";
import { HomeQuestions } from "@/features/home/home-questions";
import HomeSaleProducts from "@/features/home/home-sale-products";
import HomeWelcome from "@/features/home/home-welcome";
import Image from "next/image";
import { Subscribe } from "@/components/common";
import { VoucherBanner } from "@/features/home/home-banner-voucher";

import { useTranslations } from "next-intl";

export default function Home() {
    const t = useTranslations("home.hero");
    return (
        <>
            <Header />
            <div className="flex min-h-screen flex-col font-sans">
                <section className="relative grid min-h-[60vh] grid-cols-1 items-center justify-center gap-12 bg-linear-to-r from-emerald-50 via-stone-50 to-lime-200 px-6 py-12 text-center md:grid-cols-2 md:text-left lg:py-24 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                    <div className="relative z-10 mx-auto max-w-2xl text-slate-950 md:col-span-1 md:mx-0 dark:text-slate-100">
                        <Badge className="mb-4 bg-linear-to-r from-purple-700 via-pink-500 to-orange-300 px-4 py-1.5 text-xs text-white uppercase sm:text-sm">
                            {t("badge")}
                        </Badge>
                        <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-slate-900 uppercase sm:text-4xl lg:text-6xl dark:text-slate-100">
                            {t("title")}
                        </h1>
                        <p className="mb-8 text-base text-slate-700 sm:text-lg dark:text-slate-400">
                            {t("description")}
                        </p>
                        <div className="flex justify-center md:justify-start">
                            <Button
                                size="lg"
                                className="bg-info-darker hover:bg-info h-12 cursor-pointer rounded-full px-10 text-white transition-all hover:scale-105"
                            >
                                {t("button")}
                            </Button>
                        </div>
                    </div>
                    <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden md:col-span-1 md:max-w-md lg:max-w-lg">
                        <Image
                            src="https://www.plug.tech/cdn/shop/files/PLUG_HERO_IPHONE.webp?v=1766781483"
                            alt="Hero Background"
                            fill
                            loading="eager"
                            className="object-contain transition-transform duration-700 hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                </section>

                <main className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
                    <VoucherBanner />
                    <HomeCarousel />
                    <HomeSaleProducts />
                    <HomeDeals />
                    <HomeWelcome />
                    <HomeFeedBack />
                    <HomeQuestions />
                </main>

                <Subscribe />
            </div>
            <Footer />
        </>
    );
}
