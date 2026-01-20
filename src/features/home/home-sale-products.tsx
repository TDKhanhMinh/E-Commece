"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeartIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import SimpleBar from "simplebar-react";
import { useRouter } from "next/navigation";
export const MOCK_CAROUSEL_PRODUCT_ITEMS = [
    {
        id: 1,
        label: "iphone-16-pro-max",
        brand: "Apple",
        name: "iPhone 16 Pro Max Black Titanium 256GB (Unlocked)",
        imgUrl: "https://www.plug.tech/cdn/shop/files/MacbookProM2Silver_Ariel_1_abf0003e-9cac-4154-a619-0a92e3045a1a.png?v=1747230954&width=500",
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
export default function HomeSaleProducts() {
    const t = useTranslations("HomePage");
    const navigate = useRouter();
    return (
        <div className="flex flex-col gap-8 bg-zinc-50 pt-6 pb-8 dark:bg-zinc-800/50">
            <section className="">
                <div className="container mx-auto h-full px-4 text-center">
                    <div className="mx-auto mb-12 max-w-3xl">
                        <span className="mb-12 bg-gradient-to-r from-orange-500 via-indigo-500 to-green-500 bg-clip-text text-xl font-bold tracking-tighter text-transparent uppercase">
                            Handpicked for you
                        </span>
                        <h2 className="mt-0.5 font-bold uppercase md:text-4xl">
                            Tech you’ll love – Top picks for you
                        </h2>
                    </div>
                    <div className="mb-6 flex flex-row justify-center gap-4">
                        {[
                            "All",
                            "iPhone",
                            "MacBook",
                            "iPad",
                            "Watch",
                            "Audio",
                        ].map((category) => (
                            <Button
                                key={category}
                                variant="outline"
                                className="hover:bg-primary cursor-pointer rounded-full px-6 py-3 font-semibold transition-colors hover:text-white"
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                    <SimpleBar autoHide={true} style={{ maxWidth: "100%" }}>
                        <div className="flex flex-nowrap gap-6 px-4">
                            {MOCK_CAROUSEL_PRODUCT_ITEMS.map((item) => (
                                <Card
                                    onClick={() => navigate.push("/product/1")}
                                    key={item.label}
                                    className="group relative mb-5 flex w-2/6 shrink-0 cursor-pointer flex-col items-center gap-2 p-6 shadow-xl transition-transform hover:-translate-y-1"
                                >
                                    <div className="flex w-full items-center justify-between">
                                        <Label className="rounded-md bg-gradient-to-tl from-[#fde68a] to-[#f59e0b] px-4 py-1.5 text-sm font-bold text-black uppercase">
                                            Sales
                                        </Label>
                                        <Button
                                            className="cursor-pointer rounded-full"
                                            variant="outline"
                                            size="icon"
                                            aria-label="Submit"
                                        >
                                            <HeartIcon className="h-5 w-5" />
                                        </Button>
                                    </div>
                                    <div className="relative h-[150px] w-[150px]">
                                        <Image
                                            src={item.imgUrl}
                                            alt={item.label}
                                            fill
                                            className="object-contain transition-opacity duration-300 group-hover:opacity-0"
                                        />

                                        <Image
                                            src={item.hoverImgUrl}
                                            alt={item.label}
                                            fill
                                            className="object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                        />
                                    </div>
                                    <p className="text-secondary-dark w-full text-start">
                                        {item.brand}
                                    </p>
                                    <div className="text-md w-full truncate py-2 text-start font-bold">
                                        {item.name}
                                    </div>
                                    <div className="flex w-full flex-row items-center justify-between gap-2 text-start">
                                        <div className="flex flex-col text-start">
                                            <span className="text-secondary-dark font-bold">
                                                From $
                                                {item.price.current.toLocaleString()}{" "}
                                                VND
                                            </span>
                                            <span className="text-muted-foreground text-xs line-through">
                                                $
                                                {item.price.old.toLocaleString()}{" "}
                                                VND
                                            </span>
                                        </div>
                                        <Badge className="text-secondary-dark mx-2 h-8 bg-yellow-500 text-base font-semibold backdrop-blur-sm">
                                            <span className="px-2">
                                                Save{" "}
                                                {item.price.discountPercent}%
                                            </span>
                                        </Badge>
                                    </div>

                                    <div className="mt-4 flex w-full gap-2 text-start">
                                        {item.colors.map((color) => (
                                            <Button
                                                key={color}
                                                className={`h-8 w-8 rounded-full border-2 bg-white p-0 px-0 py-0 font-semibold hover:border-green-400 hover:bg-transparent hover:shadow-md`}
                                            >
                                                <div
                                                    className={`${color} h-4 rounded-full p-2 font-semibold text-white`}
                                                ></div>
                                            </Button>
                                        ))}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </SimpleBar>
                </div>
            </section>
            <div className="container mx-auto px-4 text-center">
                <Link href="/products">
                    <Button className="cursor-pointer rounded-full bg-green-900 px-16 py-4 text-lg font-bold text-white transition-colors hover:bg-green-800/80">
                        View all
                    </Button>
                </Link>
            </div>
        </div>
    );
}
