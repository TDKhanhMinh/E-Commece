"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import SimpleBar from "simplebar-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { HeartIcon, ShieldCheckIcon, Star } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { MOCK_CAROUSEL_PRODUCT_ITEMS } from "../../../mock";

export default function HomeFeedBack() {
    const t = useTranslations("HomePage");

    return (
        <div className="mt-24 flex flex-col gap-8 py-5">
            <section className="">
                <div className="container mx-auto h-full px-4 text-center">
                    <div className="mx-auto mb-12 max-w-5xl">
                        <span className="mb-12 bg-gradient-to-r from-orange-500 via-indigo-500 to-green-500 bg-clip-text text-xl font-bold tracking-tighter text-transparent uppercase">
                            TRUSTED BY MANY, LOVED BY ALL
                        </span>
                        <h2 className="my-1 font-bold uppercase md:text-4xl">
                            Real experiences. Real satisfaction.
                        </h2>
                    </div>
                    <SimpleBar autoHide={true} style={{ maxWidth: "100%" }}>
                        <div className="flex flex-nowrap gap-6 px-4">
                            {MOCK_CAROUSEL_PRODUCT_ITEMS.map((item) => (
                                <Card
                                    key={item.label}
                                    className="group relative mb-5 flex w-2/6 shrink-0 cursor-pointer flex-col items-center gap-2 p-6 shadow-xl transition-transform hover:-translate-y-1"
                                >
                                    <div className="flex w-full items-center justify-between gap-2">
                                        <div className="flex w-full flex-col items-start gap-1 text-start">
                                            <div className="flex w-full flex-row items-center gap-1">
                                                {["1", "2", "3", "4", "5"].map(
                                                    (item) => (
                                                        <Star
                                                            key={item}
                                                            className="uppercase"
                                                        ></Star>
                                                    )
                                                )}
                                            </div>
                                            <span>Alex S.</span>
                                            <div className="flex flex-row items-start justify-center">
                                                <ShieldCheckIcon className="text-success h-4 w-4" />
                                                <div className="text-secondary-dark border-r border-black/20 px-2 text-sm">
                                                    Verified Purchase
                                                </div>
                                                <div className="text-secondary-dark ml-2 text-sm">
                                                    1/1/2026
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative h-18 w-18">
                                            <Image
                                                src="https://www.plug.tech/cdn/shop/files/Alexi_S._Galaxy_Watch_4_Classic_46MM_Silver_Stainless_Review.webp?v=1768322270&width=1200"
                                                fill
                                                alt="feedback image"
                                                className="w-full rounded-md object-cover shadow-lg"
                                            />
                                        </div>
                                    </div>

                                    <div className="text-md w-full truncate py-2 text-start font-bold">
                                        {item.name}
                                    </div>
                                    <div className="text-secondary-foreground flex min-h-36 w-full justify-between gap-2 text-start text-sm">
                                        This is my first time buying a watch
                                        from PlugTech, but I’m glad to say I’m
                                        impressed by the quality of it. There
                                        was no scratches, it turned on, and it
                                        was a good price too.
                                    </div>

                                    <div className="w-full">
                                        <div className="mt-4 flex w-full flex-row items-center">
                                            <div className="relative h-16 w-12">
                                                <Image
                                                    src="https://www.plug.tech/cdn/shop/files/Alexi_S._Galaxy_Watch_4_Classic_46MM_Silver_Stainless_Review.webp?v=1768322270&width=1200"
                                                    fill
                                                    alt="feedback image"
                                                    className="w-full rounded-md object-cover shadow-lg"
                                                />
                                            </div>
                                            <div className="w-full text-sm">
                                                <span className="text-secondary-foreground ml-4 line-clamp-2 text-start text-sm">
                                                    Samsung Galaxy Watch 4
                                                    Classic 46MM (GPS) - Silver
                                                    Stainless Steel
                                                </span>

                                                <div className="flex w-full justify-start">
                                                    <Button
                                                        variant="ghost"
                                                        className="text-yellow-800 hover:bg-transparent hover:text-yellow-500 hover:underline"
                                                    >
                                                        More Reviews
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </SimpleBar>
                </div>
            </section>
        </div>
    );
}
