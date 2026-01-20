"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
export const MOCK_ABOUT_US_PRODUCT_ITEMS = [
    {
        id: 1,
        title: "Premium Quality You Can Feel",
        description:
            "Only top-tier devices that meet our highest standards make the cut. Every Plug device is hand-selected for exceptional quality with original components, strong battery health, and the reliable performance you expect from premium tech. No shortcuts, no guesswork just high-grade devices that look great, feel great, and deliver a like-new experience.",
        image: "https://www.plug.tech/cdn/shop/files/1_1_849b84c6-360e-435d-858a-ce64226883ce.jpg?v=1767904829&width=800",
    },
    {
        id: 2,
        title: "A Premium, Gift-Ready Unboxing Experience",
        description:
            "Certified Pre-Owned should still feel special. Your device arrives in beautifully designed Plug packaging with careful protection, clean presentation, and a ready-to-use setup. Whether it's for you or a gift, the experience is intentionally elevated from the moment you open the box.",
        image: "https://www.plug.tech/cdn/shop/files/2_1.jpg?v=1767904875&width=800",
    },
    {
        id: 3,
        title: "Recommended by The New York Times",
        description:
            "Trusted by leading tech reviewers. Chosen by millions. Plug has been recommended by The New York Times’ Wirecutter for quality, reliability, and value, recognition that reflects our commitment to delivering Certified Pre-Owned tech you can feel confident about.",
        image: "https://www.plug.tech/cdn/shop/files/3_e41836d7-f233-4c5a-8951-5fcd46e7363d.jpg?v=1767904889&width=800",
    },
    {
        id: 4,
        title: "Planet-Positive by Design",
        description:
            "Better tech, smaller footprint. Every Plug device keeps high-quality electronics out of landfills and extends the life of valuable materials. With R2-certified processes and over 1M+ pounds of tech diverted from waste since 2021, choosing Plug helps support a more sustainable future.",
        image: "https://www.plug.tech/cdn/shop/files/4_83bc2381-d131-45b3-bd3c-01e5278d0c7e.jpg?v=1767904899&width=800",
    },
];
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
