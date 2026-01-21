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
import ProductItem from "@/components/common/product-item";
import { MOCK_CAROUSEL_PRODUCT_ITEMS } from "../../../mock";
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
                                <ProductItem item={item} key={item.id} />
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
