"use client";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Laptop, Watch, Headphones, Tablet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import SimpleBar from "simplebar-react";
export const MOCK_CAROUSEL_ITEMS = [
    {
        label: "iphone",
        title: "Seamless. Secure. Simply iPhone.",
        imgUrl: "https://www.plug.tech/cdn/shop/files/4_1f8415dc-f90e-461a-98d0-5dae5f021a60.png?v=1749051534&width=500",
    },
    {
        label: "android",
        title: "Explore Top Android Picks.",
        imgUrl: "https://www.plug.tech/cdn/shop/files/6_649e52d3-db65-405c-a1c6-d59a189f1dba.png?v=1749051542&width=500",
    },
    {
        label: "ipads",
        title: "Work hard. Play smart",
        imgUrl: "https://www.plug.tech/cdn/shop/files/5_c5c5586e-ab16-423a-8b3f-89f004f84143.png?v=1749051922&width=500",
    },
    {
        label: "macbooks",
        title: "Stay connected, Stay active.",
        imgUrl: "https://www.plug.tech/cdn/shop/files/MacbookProM2Silver_Ariel_1_abf0003e-9cac-4154-a619-0a92e3045a1a.png?v=1747230954&width=500",
    },
    {
        label: "audio",
        title: "Certified beats, Everyday vibes.",
        imgUrl: "https://www.plug.tech/cdn/shop/files/Untitled_500x500px_52_3f2ef5a5-d0cd-4554-a188-d00a2e3ac59e.png?v=1746197540&width=500",
    },
    {
        label: "smartwatches",
        title: "Stay connected, Stay active.",
        imgUrl: "https://www.plug.tech/cdn/shop/files/Apple-Watch.png?v=1749047829&width=500",
    },
    {
        label: "Plug packs",
        title: "Ready make bundles, Curated by Plug.",
        imgUrl: "https://www.plug.tech/cdn/shop/files/MacbookProM2Silver_Ariel_1_abf0003e-9cac-4154-a619-0a92e3045a1a.png?v=1747230954&width=500",
    },
];
export default function HomeCarousel() {
    const t = useTranslations("HomePage");

    return (
        <div className="flex flex-col gap-20 pb-20">
            <section className="bg-zinc-50 py-6 dark:bg-zinc-700/50">
                <div className="container mx-auto h-full px-4 text-center">
                    <div className="mx-auto mb-12 max-w-3xl">
                        <span className="mb-12 bg-gradient-to-r from-orange-500 via-indigo-500 to-green-500 bg-clip-text text-xl font-bold tracking-tighter text-transparent uppercase">
                            Trusted by Many, Loved by All
                        </span>
                        <h2 className="mt-0.5 font-bold uppercase md:text-4xl">
                            Explore our Top Tech
                        </h2>
                    </div>

                    <SimpleBar autoHide={true} style={{ maxWidth: "100%" }}>
                        <div className="flex flex-nowrap gap-6 px-4">
                            {MOCK_CAROUSEL_ITEMS.map((item) => (
                                <Card
                                    key={item.label}
                                    className="mb-5 flex w-2/6 shrink-0 cursor-pointer flex-col items-center gap-4 p-6 shadow-xl transition-transform hover:-translate-y-1"
                                >
                                    <Label className="rounded-md bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 px-3 py-1 text-lg font-semibold text-white uppercase">
                                        {item.label}
                                    </Label>

                                    <div className="text-center text-2xl font-bold">
                                        {item.title}
                                    </div>

                                    <Image
                                        className="h-full"
                                        src={item.imgUrl}
                                        alt={item.label}
                                        width={150}
                                        height={150}
                                    />
                                </Card>
                            ))}
                        </div>
                    </SimpleBar>
                </div>
            </section>
        </div>
    );
}
