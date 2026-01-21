"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { MOCK_ABOUT_US_PRODUCT_ITEMS } from "../../../mock";
export default function ProductAboutUs() {
    return (
        <div className="mt-24 flex flex-col gap-8 py-5">
            <section className="">
                <div className="container mx-auto h-full px-4 text-center">
                    <div className="mx-auto mb-12 max-w-5xl">
                        <span className="mb-12 bg-gradient-to-r from-orange-500 via-indigo-500 to-green-500 bg-clip-text text-xl font-bold tracking-tighter text-transparent uppercase">
                            ABOUT US
                        </span>
                        <h2 className="my-1 font-bold uppercase md:text-4xl">
                            What makes us different?
                        </h2>
                        <p className="text-secondary mt-3 text-base">
                            We strongly believe the only difference between
                            purchasing a new or Certified Pre-Owned device
                            should be price.
                        </p>
                    </div>
                    <div className="mb-8 grid grid-cols-1 gap-4 text-center md:grid-cols-2">
                        {MOCK_ABOUT_US_PRODUCT_ITEMS.map((item) => (
                            <div className="flex flex-col" key={item.title}>
                                <Card className="grid h-[300px] grid-cols-2 bg-gray-50 p-8 text-left shadow-xl transition-transform duration-300 hover:scale-[1.02]">
                                    <div className="flex flex-col items-start">
                                        <h2 className="text-secondary-dark mb-2 text-lg font-semibold">
                                            {item.title}
                                        </h2>
                                        <p className="text-secondary text-sm">
                                            {item.description}
                                        </p>
                                    </div>
                                    <div className="relative w-full overflow-hidden rounded-2xl">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <div className="container mx-auto px-4 text-center">
                <Link href="/products">
                    <Button className="cursor-pointer rounded-full bg-green-900 px-32 py-4 text-lg font-bold text-white transition-colors hover:bg-green-800/80">
                        View all
                    </Button>
                </Link>
            </div>
        </div>
    );
}
