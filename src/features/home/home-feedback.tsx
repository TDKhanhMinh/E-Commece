"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import SimpleBar from "simplebar-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { HeartIcon, ShieldCheckIcon, Star } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
export const MOCK_CAROUSEL_PRODUCT_ITEMS = [
    {
        id: 1,
        label: "iphone-16-pro-max",
        brand: "Apple",
        name: "iPhone 16 Pro Max Black Titanium 256GB (Unlocked)",
        imgUrl: "https://www.plug.tech/cdn/shop/files/PLUG_HERO_TECH.webp?v=1766780092&width=1000",
        hoverImgUrl:
            "https://www.plug.tech/cdn/shop/files/Apple-Watch.png?v=1749047829&width=500",
        price: {
            current: 1499000,
            old: 1699000,
            currency: "VND",
            discountPercent: 12,
        },
        colors: [
            "bg-primary",
            "bg-secondary",
            "bg-black",
            "bg-white",
            "bg-red",
        ],
        isFavorite: false,
    },
    {
        id: 2,
        label: "iphone-16-pro",
        brand: "Apple",
        name: "iPhone 16 Pro Natural Titanium 128GB",
        imgUrl: "https://www.plug.tech/cdn/shop/files/MacbookProM2Silver_Ariel_1_abf0003e-9cac-4154-a619-0a92e3045a1a.png?v=1747230954&width=500",
        hoverImgUrl:
            "https://www.plug.tech/cdn/shop/files/Apple-Watch.png?v=1749047829&width=500",
        price: {
            current: 1299000,
            old: 1499000,
            currency: "VND",
            discountPercent: 13,
        },
        colors: ["bg-black", "bg-white", "bg-secondary"],
        isFavorite: true,
    },
    {
        id: 3,
        label: "iphone-15",
        brand: "Apple",
        name: "iPhone 15 Blue 128GB",
        imgUrl: "https://www.plug.tech/cdn/shop/files/MacbookProM2Silver_Ariel_1_abf0003e-9cac-4154-a619-0a92e3045a1a.png?v=1747230954&width=500",
        hoverImgUrl:
            "https://www.plug.tech/cdn/shop/files/Apple-Watch.png?v=1749047829&width=500",
        price: {
            current: 999000,
            old: 1199000,
            currency: "VND",
            discountPercent: 17,
        },
        colors: ["bg-blue-500", "bg-black", "bg-white"],
        isFavorite: false,
    },
    {
        id: 4,
        label: "samsung-s24-ultra",
        brand: "Samsung",
        name: "Galaxy S24 Ultra 512GB Titanium Gray",
        imgUrl: "https://www.plug.tech/cdn/shop/files/MacbookProM2Silver_Ariel_1_abf0003e-9cac-4154-a619-0a92e3045a1a.png?v=1747230954&width=500",
        hoverImgUrl:
            "https://www.plug.tech/cdn/shop/files/Apple-Watch.png?v=1749047829&width=500",
        price: {
            current: 1399000,
            old: 1599000,
            currency: "VND",
            discountPercent: 12,
        },
        colors: ["bg-gray-500", "bg-black", "bg-white"],
        isFavorite: false,
    },
    {
        id: 5,
        label: "samsung-s24",
        brand: "Samsung",
        name: "Galaxy S24 256GB Violet",
        imgUrl: "https://www.plug.tech/cdn/shop/files/MacbookProM2Silver_Ariel_1_abf0003e-9cac-4154-a619-0a92e3045a1a.png?v=1747230954&width=500",
        hoverImgUrl:
            "https://www.plug.tech/cdn/shop/files/Apple-Watch.png?v=1749047829&width=500",
        price: {
            current: 1099000,
            old: 1299000,
            currency: "VND",
            discountPercent: 15,
        },
        colors: ["bg-purple-500", "bg-black", "bg-white"],
        isFavorite: true,
    },
    {
        id: 6,
        label: "pixel-9-pro",
        brand: "Google",
        name: "Pixel 9 Pro Obsidian 256GB",
        imgUrl: "https://www.plug.tech/cdn/shop/files/MacbookProM2Silver_Ariel_1_abf0003e-9cac-4154-a619-0a92e3045a1a.png?v=1747230954&width=500",
        hoverImgUrl:
            "https://www.plug.tech/cdn/shop/files/Apple-Watch.png?v=1749047829&width=500",
        price: {
            current: 1199000,
            old: 1399000,
            currency: "VND",
            discountPercent: 14,
        },
        colors: ["bg-black", "bg-white", "bg-green-500"],
        isFavorite: false,
    },
    {
        id: 7,
        label: "xiaomi-14-ultra",
        brand: "Xiaomi",
        name: "Xiaomi 14 Ultra 512GB Black",
        imgUrl: "https://www.plug.tech/cdn/shop/files/MacbookProM2Silver_Ariel_1_abf0003e-9cac-4154-a619-0a92e3045a1a.png?v=1747230954&width=500",
        hoverImgUrl:
            "https://www.plug.tech/cdn/shop/files/Apple-Watch.png?v=1749047829&width=500",
        price: {
            current: 999000,
            old: 1199000,
            currency: "VND",
            discountPercent: 17,
        },
        colors: ["bg-black", "bg-white"],
        isFavorite: false,
    },
    {
        id: 8,
        label: "oppo-find-x7",
        brand: "OPPO",
        name: "OPPO Find X7 Pro 256GB Blue",
        imgUrl: "https://www.plug.tech/cdn/shop/files/MacbookProM2Silver_Ariel_1_abf0003e-9cac-4154-a619-0a92e3045a1a.png?v=1747230954&width=500",
        hoverImgUrl:
            "https://www.plug.tech/cdn/shop/files/Apple-Watch.png?v=1749047829&width=500",
        price: {
            current: 1099000,
            old: 1299000,
            currency: "VND",
            discountPercent: 15,
        },
        colors: ["bg-blue-500", "bg-black"],
        isFavorite: false,
    },
    {
        id: 9,
        label: "vivo-x100-pro",
        brand: "Vivo",
        name: "Vivo X100 Pro 512GB Black",
        imgUrl: "https://www.plug.tech/cdn/shop/files/MacbookProM2Silver_Ariel_1_abf0003e-9cac-4154-a619-0a92e3045a1a.png?v=1747230954&width=500",
        hoverImgUrl:
            "https://www.plug.tech/cdn/shop/files/Apple-Watch.png?v=1749047829&width=500",
        price: {
            current: 1049000,
            old: 1249000,
            currency: "VND",
            discountPercent: 16,
        },
        colors: ["bg-black", "bg-red"],
        isFavorite: true,
    },
    {
        id: 10,
        label: "oneplus-12",
        brand: "OnePlus",
        name: "OnePlus 12 256GB Emerald Green",
        imgUrl: "https://www.plug.tech/cdn/shop/files/MacbookProM2Silver_Ariel_1_abf0003e-9cac-4154-a619-0a92e3045a1a.png?v=1747230954&width=500",
        hoverImgUrl:
            "https://www.plug.tech/cdn/shop/files/Apple-Watch.png?v=1749047829&width=500",
        price: {
            current: 949000,
            old: 1149000,
            currency: "VND",
            discountPercent: 17,
        },
        colors: ["bg-green-500", "bg-black"],
        isFavorite: false,
    },
];
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
