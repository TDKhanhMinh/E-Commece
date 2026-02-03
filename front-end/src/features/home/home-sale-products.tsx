"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import SimpleBar from "simplebar-react";
import ProductItem from "@/components/common/product/product-item";
import { useProducts } from "@/hooks/use-products";
import { PageResponse } from "@/service/http";

export default function HomeSaleProducts() {
    const t = useTranslations("HomePage");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    // Fetch products using TanStack Query
    const { data, isLoading } = useProducts({
        page: 0,
        size: 12, // Lấy 12 sản phẩm để hiển thị
    });

    // Extract products from PageResponse
    const pageData = data as PageResponse<any> | undefined;
    const products = pageData?.content || [];
    console.log("Fetched Products:", products);

    // Categories
    const categories = ["All", "iPhone", "MacBook", "iPad", "Watch", "Audio"];

    return (
        <div className="flex flex-col gap-8 bg-zinc-50 pt-6 pb-8 dark:bg-zinc-800/50">
            <section className="">
                <div className="container mx-auto h-full px-4 text-center">
                    <div className="mx-auto mb-12 max-w-3xl">
                        <span className="mb-12 bg-gradient-to-r from-orange-500 via-indigo-500 to-green-500 bg-clip-text text-xl font-bold tracking-tighter text-transparent uppercase">
                            Handpicked for you
                        </span>
                        <h2 className="mt-0.5 font-bold uppercase md:text-4xl">
                            Tech you'll love – Top picks for you
                        </h2>
                    </div>

                    {/* Category Filters */}
                    <div className="mb-6 flex flex-row justify-center gap-4">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant="outline"
                                onClick={() => setSelectedCategory(category)}
                                className={`cursor-pointer rounded-full px-6 py-3 font-semibold transition-colors ${
                                    selectedCategory === category
                                        ? "bg-primary text-white"
                                        : "hover:bg-primary hover:text-white"
                                }`}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>

                    {/* Products Display with Loading States */}
                    {isLoading ? (
                        <div className="flex h-64 items-center justify-center">
                            <div className="text-lg text-gray-500">
                                Đang tải sản phẩm...
                            </div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="flex h-64 items-center justify-center">
                            <div className="text-lg text-gray-500">
                                Không có sản phẩm nào
                            </div>
                        </div>
                    ) : (
                        <SimpleBar autoHide={true} style={{ maxWidth: "100%" }}>
                            <div className="flex flex-nowrap gap-6 px-4">
                                {products.map((item: any) => (
                                    <ProductItem item={item} key={item.id} />
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
                        View all
                    </Button>
                </Link>
            </div>
        </div>
    );
}
