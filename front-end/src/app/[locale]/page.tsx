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
                <section className="relative grid min-h-[60vh] grid-cols-2 items-center justify-center bg-linear-to-r from-emerald-50 via-stone-50 to-lime-200 px-6 py-20 text-center dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                    <div className="relative z-10 text-slate-950 md:col-span-1 md:text-left dark:text-slate-100">
                        <Badge className="mb-4 bg-linear-to-r from-purple-700 via-pink-500 to-orange-300 p-2 text-sm text-white uppercase">
                            {t("badge")}
                        </Badge>
                        <div className="mb-6 text-3xl font-extrabold tracking-tight text-slate-900 uppercase sm:text-4xl lg:text-5xl dark:text-slate-100">
                            {t("title")}
                        </div>
                        <p className="mb-8 text-lg text-slate-700 dark:text-slate-400">
                            {t("description")}
                        </p>
                        <div className="text-white">
                            <Button
                                size="sm"
                                className="bg-info-darker hover:bg-info h-10 cursor-pointer rounded-full px-8"
                            >
                                {t("button")}
                            </Button>
                        </div>
                    </div>
                    <div className="relative left-[30%] h-full max-w-sm overflow-hidden md:col-span-1">
                        <Image
                            src="https://www.plug.tech/cdn/shop/files/PLUG_HERO_IPHONE.webp?v=1766781483&width=375%20375w,%20//www.plug.tech/cdn/shop/files/PLUG_HERO_IPHONE.webp?v=1766781483&width=550%20550w,%20//www.plug.tech/cdn/shop/files/PLUG_HERO_IPHONE.webp?v=1766781483&width=800%20800w"
                            alt="Hero Background"
                            fill
                            loading={"eager"}
                            className="object-cover"
                        />
                    </div>
                </section>

                <main className="container mx-auto px-4 py-20">
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
