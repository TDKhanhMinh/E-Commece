"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import DealItem from "@/components/common/deal-item";
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
export default function HomeDeals() {
    const t = useTranslations("HomePage");

    return (
        <div className="flex flex-col gap-8 py-5">
            <section className="">
                <div className="container mx-auto h-full px-4 text-center">
                    <div className="mx-auto mb-12 max-w-5xl">
                        <span className="mb-12 bg-gradient-to-r from-orange-500 via-indigo-500 to-green-500 bg-clip-text text-xl font-bold tracking-tighter text-transparent uppercase">
                            Limited-Time Deals
                        </span>
                        <h2 className="my-1 font-bold uppercase md:text-4xl">
                            Smart upgrades start with bigger savings.
                        </h2>
                        <p className="text-secondary mt-3 text-base">
                            The tech you want, without the new-price tag. Shop
                            certified iPhones, AirPods, MacBooks, and iPads for
                            less. All headache free and backed by Plug's
                            12-month warranty.
                        </p>
                    </div>
                    <div className="mb-8 grid grid-cols-1 gap-4 text-center md:grid-cols-2">
                        <div className="flex flex-col">
                            <DealItem
                                name="Iphone 16"
                                description="From $503. Classic with all features and battery that’s ideal for upgrading from older iPhones."
                                productLink="/products/iphone-16-pro-max"
                                imgUrl="https://www.plug.tech/cdn/shop/files/Apple-Watch.png?v=1749047829&width=500"
                                hoverImgUrl="https://www.plug.tech/cdn/shop/files/MacbookProM2Silver_Ariel_1_abf0003e-9cac-4154-a619-0a92e3045a1a.png?v=1747230954&width=500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <DealItem
                                name="Iphone 16"
                                description="From $503. Classic with all features and battery that’s ideal for upgrading from older iPhones."
                                productLink="/products/iphone-16-pro-max"
                                imgUrl="https://www.plug.tech/cdn/shop/files/Apple-Watch.png?v=1749047829&width=500"
                                hoverImgUrl="https://www.plug.tech/cdn/shop/files/MacbookProM2Silver_Ariel_1_abf0003e-9cac-4154-a619-0a92e3045a1a.png?v=1747230954&width=500"
                            />
                        </div>
                    </div>

                    <div className="mb-8 grid grid-cols-1 gap-4 text-center md:grid-cols-4">
                        {MOCK_CAROUSEL_PRODUCT_ITEMS.slice(0, 4).map((item) => (
                            <DealItem
                                key={item.id}
                                name={item.name}
                                description={item.name}
                                productLink={`/products/${item.label}`}
                                imgUrl={item.imgUrl}
                                hoverImgUrl={item.hoverImgUrl}
                            />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-1">
                        {MOCK_CAROUSEL_PRODUCT_ITEMS.slice(0, 1).map((item) => (
                            <DealItem
                                key={item.id}
                                name={item.name}
                                description={item.name}
                                productLink={`/products/${item.label}`}
                                imgUrl={item.imgUrl}
                                hoverImgUrl={item.hoverImgUrl}
                            />
                        ))}
                    </div>
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
