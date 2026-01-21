"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import DealItem from "@/components/common/deal-item";
import { MOCK_CAROUSEL_PRODUCT_ITEMS } from "../../../mock";
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
