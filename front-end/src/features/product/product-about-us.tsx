"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { MOCK_ABOUT_US_PRODUCT_ITEMS } from "../../../mock";

export default function ProductAboutUs() {
    return (
        <div className="mt-16 flex flex-col gap-8 py-5 sm:mt-24">
            <section className="">
                <div className="container mx-auto h-full px-4 text-center">
                    <div className="mx-auto mb-8 max-w-5xl sm:mb-12">
                        <span className="mb-4 block bg-gradient-to-r from-orange-500 via-indigo-500 to-green-500 bg-clip-text text-sm font-bold tracking-tighter text-transparent uppercase sm:text-lg lg:text-xl">
                            ABOUT US
                        </span>
                        <h2 className="text-2xl font-bold uppercase sm:text-3xl md:text-4xl dark:text-slate-100">
                            What makes us different?
                        </h2>
                        <p className="text-muted-foreground mt-4 text-sm sm:text-base dark:text-slate-400">
                            We strongly believe the only difference between
                            purchasing a new or Certified Pre-Owned device
                            should be price.
                        </p>
                    </div>
                    <div className="mb-8 grid grid-cols-1 gap-4 text-center sm:gap-6 lg:grid-cols-2">
                        {MOCK_ABOUT_US_PRODUCT_ITEMS.map((item) => (
                            <div className="flex flex-col" key={item.title}>
                                <Card className="flex flex-col overflow-hidden bg-gray-50 text-left shadow-lg transition-transform duration-300 hover:scale-[1.01] sm:flex-row sm:h-[280px] dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-slate-950/50">
                                    <div className="flex flex-1 flex-col justify-center p-6 sm:p-8">
                                        <h3 className="text-secondary-dark mb-2 text-lg font-bold sm:text-xl dark:text-slate-100">
                                            {item.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed dark:text-slate-400">
                                            {item.description}
                                        </p>
                                    </div>
                                    <div className="relative h-48 w-full shrink-0 sm:h-auto sm:w-2/5">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 100vw, 40vw"
                                        />
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <div className="container mx-auto px-4 text-center">
                <Link href="/product" className="inline-block w-full sm:w-auto">
                    <Button className="w-full cursor-pointer rounded-full bg-green-900 py-6 text-base font-bold text-white transition-colors hover:bg-green-800/80 sm:w-auto sm:px-24 sm:text-lg dark:bg-green-700 dark:hover:bg-green-600">
                        View all
                    </Button>
                </Link>
            </div>
        </div>
    );
}
