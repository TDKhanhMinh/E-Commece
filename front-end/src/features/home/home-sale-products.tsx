"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import SimpleBar from "simplebar-react";
import ProductItem from "@/components/common/product/product-item";
import { useProducts } from "@/hooks/use-products";
import { PageResponse } from "@/type/api-type";

export default function HomeSaleProducts() {
    const t = useTranslations("home.sale");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const { data, isLoading } = useProducts({
        page: 0,
        size: 12,
    });

    const pageData = data as PageResponse<any> | undefined;
    const products = pageData?.content || [];

    const categories = ["All", "iPhone", "MacBook", "iPad", "Watch", "Audio"];

    return (
        <div className="flex flex-col gap-8 bg-zinc-50 py-8 sm:py-12 lg:py-16 dark:bg-zinc-900/50">
            <section className="">
                <div className="container mx-auto h-full px-4 text-center">
                    <div className="mx-auto mb-8 max-w-3xl sm:mb-12">
                        <span className="mb-4 block bg-gradient-to-r from-orange-500 via-indigo-500 to-green-500 bg-clip-text text-lg font-bold tracking-tighter text-transparent uppercase sm:text-xl">
                            {t("badge")}
                        </span>
                        <h2 className="mt-1 text-2xl font-bold uppercase text-slate-900 sm:text-3xl md:text-4xl dark:text-slate-100">
                            {t("title")}
                        </h2>
                    </div>

                    {/* Category Filters - Scrollable on mobile */}
                    <div className="mb-8 flex flex-nowrap items-center justify-start gap-3 overflow-x-auto px-4 pb-4 sm:flex-wrap sm:justify-center sm:gap-4 sm:overflow-x-visible sm:pb-0">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant="outline"
                                onClick={() => setSelectedCategory(category)}
                                className={`h-10 shrink-0 cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition-colors sm:h-11 sm:px-6 sm:py-3 sm:text-base ${
                                    selectedCategory === category
                                        ? "bg-primary text-white"
                                        : "hover:bg-primary hover:text-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-200 dark:hover:bg-zinc-800"
                                }`}
                            >
                                {t(`categories.${category}`)}
                            </Button>
                        ))}
                    </div>

                    {/* Products Display with Loading States */}
                    {isLoading ? (
                        <div className="flex h-64 items-center justify-center">
                            <div className="text-lg text-gray-500">
                                {t("loading")}
                            </div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="flex h-64 items-center justify-center">
                            <div className="text-lg text-gray-500">
                                {t("noProducts")}
                            </div>
                        </div>
                    ) : (
                        <SimpleBar autoHide={true} style={{ maxWidth: "100%" }}>
                            <div className="flex flex-nowrap gap-4 px-4 pb-8 sm:gap-6">
                                {products.map((item: any) => (
                                    <div key={item.id} className="w-[260px] shrink-0 sm:w-[300px]">
                                        <ProductItem item={item} />
                                    </div>
                                ))}
                            </div>
                        </SimpleBar>
                    )}
                </div>
            </section>


            {/* View All Button */}
            <div className="container mx-auto px-4 text-center">
                <Link href="/products">
                    <Button className="cursor-pointer rounded-full bg-green-900 px-16 py-4 text-lg font-bold text-white transition-colors hover:bg-green-800/80">
                        {t("viewAll")}
                    </Button>
                </Link>
            </div>
        </div>
    );
}

