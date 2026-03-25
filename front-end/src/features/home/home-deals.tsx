"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { DealItem } from "@/components/common";
import { useProducts } from "@/hooks/use-products";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/format-price";

export default function HomeDeals() {
    const t = useTranslations("HomePage");

    const { data, isLoading, isError } = useProducts({
        page: 0,
        size: 7,
    });
    // @ts-ignore
    const products = data?.content || data?.data || data || [];

    const topDeals = products.slice(0, 2);
    const middleDeals = products.slice(2, 6);
    const bottomDeal = products.slice(6, 7);

    if (isLoading) {
        return (
            <div className="flex min-h-100 w-full items-center justify-center">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (isError || products.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-8 py-5">
            <section className="">
                <div className="container mx-auto h-full px-4 text-center">
                    <div className="mx-auto mb-12 max-w-5xl">
                        <span className="mb-12 bg-linear-to-r from-orange-500 via-indigo-500 to-green-500 bg-clip-text text-xl font-bold tracking-tighter text-transparent uppercase">
                            Limited-Time Deals
                        </span>
                        <h2 className="my-1 text-2xl font-bold uppercase md:text-4xl">
                            Smart upgrades start with bigger savings.
                        </h2>
                        <p className="text-secondary mt-3 text-base">
                            The tech you want, without the new-price tag. Shop
                            certified iPhones, AirPods, MacBooks, and iPads for
                            less. All headache free and backed by T7M's 12-month
                            warranty.
                        </p>
                    </div>

                    {/* Section 1: 2 Deals lớn */}
                    {topDeals.length > 0 && (
                        <div className="mb-8 grid grid-cols-1 gap-4 text-center md:grid-cols-2">
                            {topDeals.map((item: any) => (
                                <div className="flex flex-col" key={item.id}>
                                    <DealItem
                                        name={item.name}
                                        description={`From ${formatCurrency(item.price || item.maxPrice)}. ${item.description || "Classic with all features."}`}
                                        productLink={`/product/${item.slug || item.id}`}
                                        imgUrl={
                                            item.image || "/placeholder.png"
                                        }
                                        hoverImgUrl={
                                            item.hoverImage ||
                                            item.image ||
                                            "/placeholder.png"
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Section 2: 4 Deals nhỏ */}
                    {middleDeals.length > 0 && (
                        <div className="mb-8 grid grid-cols-1 gap-4 text-center md:grid-cols-4">
                            {middleDeals.map((item: any) => (
                                <DealItem
                                    key={item.id}
                                    name={item.name}
                                    description={`From ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.price || item.minPrice || 0)}`}
                                    productLink={`/product/${item.slug || item.id}`}
                                    imgUrl={item.image || "/placeholder.png"}
                                    hoverImgUrl={
                                        item.hoverImage ||
                                        item.image ||
                                        "/placeholder.png"
                                    }
                                />
                            ))}
                        </div>
                    )}

                    {bottomDeal.length > 0 && (
                        <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-1">
                            {bottomDeal.map((item: any) => (
                                <DealItem
                                    key={item.id}
                                    name={item.name}
                                    description={item.description || item.name}
                                    productLink={`/product/${item.slug || item.id}`}
                                    imgUrl={item.image || "/placeholder.png"}
                                    hoverImgUrl={
                                        item.hoverImage ||
                                        item.image ||
                                        "/placeholder.png"
                                    }
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <div className="container mx-auto px-4 text-center">
                <Link href="/search">
                    <Button className="cursor-pointer rounded-full bg-green-900 px-16 py-4 text-lg font-bold text-white transition-colors hover:bg-green-800/80">
                        View all
                    </Button>
                </Link>
            </div>
        </div>
    );
}
