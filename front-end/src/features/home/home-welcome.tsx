"use client";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import Image from "next/image";
import { MOCK_CONTENT_ITEMS } from "../../../mock";

function HomeWelcome() {
    return (
        <>
            <div className="mt-12 mb-8 grid grid-cols-1 gap-4 px-4 text-center md:grid-cols-2">
                <div className="flex flex-col">
                    <div className="relative h-full w-full overflow-hidden rounded-lg md:h-full">
                        <Image
                            src="https://res.cloudinary.com/dqioktyk4/image/upload/v1768803309/ukwtm3fvsbkioxzybkfl.png"
                            alt="Hero Background"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
                <div className="flex flex-col px-3 text-start">
                    <span className="mb-3 bg-gradient-to-r from-orange-500 via-indigo-500 to-green-500 bg-clip-text text-start text-xl font-bold tracking-tighter text-transparent uppercase">
                        Welcome to T7M Tech Store
                    </span>
                    <span className="text-6xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                        Your connection to reliable, Certified
                    </span>
                    <span className="mb-2 text-6xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                        Pre-Owned devices.
                    </span>
                    <p className="text-secondary-dark mb-8 text-lg">
                        We strongly believe the only difference between
                        purchasing a new or Certified Pre-Owned device should be
                        price. That’s why we rigorously hand test, clean,
                        sanitize, and certify every device we sell.
                    </p>

                    <div className="flex flex-col gap-4">
                        {MOCK_CONTENT_ITEMS.map((item) => (
                            <div
                                key={item.title}
                                className="flex items-center gap-3"
                            >
                                <div className="bg-secondary rounded-full">
                                    <ShieldCheck className="h-14 w-14 p-2 text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-semibold">
                                        {item.title}
                                    </span>
                                    <span className="text-secondary-dark mt-1 text-sm">
                                        {item.description}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 flex w-full items-center justify-start">
                        <Button className="bg-success-darker hover:bg-success text-md cursor-pointer rounded-2xl px-24 py-4 text-white">
                            Learn more
                        </Button>
                    </div>
                </div>
            </div>
            <div className="mx-4 mt-32 mb-8 grid grid-cols-1 rounded-2xl pl-4 text-center shadow-2xl md:grid-cols-2">
                <div className="flex flex-col rounded-tl-2xl rounded-bl-2xl px-3 text-start">
                    <span className="my-3 mt-8 bg-gradient-to-r from-orange-500 via-indigo-500 to-green-500 bg-clip-text text-start text-base font-bold tracking-tighter text-transparent uppercase">
                        Bundle your favorites
                    </span>
                    <span className="text-3xl font-extrabold tracking-tight lg:text-3xl">
                        Get more, pay less!
                    </span>
                    <div className="h-65"> </div>
                    <p className="text-secondary-dark text-sm">
                        Why buy separately when you can save more? Grab
                        exclusive discounts when you bundle iPhones with
                        AirPods, MacBooks with iPads, and more.
                    </p>

                    <div className="mb-8 flex w-full items-center justify-start py-4">
                        <Button className="bg-success-darker hover:bg-success text-md cursor-pointer rounded-2xl px-20 py-4 text-white">
                            Shop Plug Packs Now
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col rounded-tr-2xl rounded-br-2xl">
                    <div className="relative h-full w-full overflow-hidden rounded-tr-2xl rounded-br-2xl md:h-full">
                        <Image
                            src="https://www.plug.tech/cdn/shop/files/Untitled_design_-_2025-06-10T113805.791.webp?v=1749573696&width=1000"
                            alt="Hero Background"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default HomeWelcome;
