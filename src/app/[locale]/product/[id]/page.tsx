"use client";

import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Heart, ShieldCheck, Star } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import ProductAboutUs from "@/features/product/product-about-us";
import HomeSaleProducts from "@/features/home/home-sale-products";
import ProductReviews from "@/features/product/product-reviews";
import { use, useState } from "react";

function ProductDetails() {
    const reviews = 1234;
    const MOCK_IMAGES = [
        "https://www.plug.tech/cdn/shop/files/iPhone15Pink_Front.png?v=1714075683&width=823",
        "https://www.plug.tech/cdn/shop/files/iPhone_1_2c3f168a-47be-427d-b556-5da7089de057.png?v=1726846779&width=823",
        "https://www.plug.tech/cdn/shop/files/iPhone15Pink_Dual.png?v=1714075675&width=823",
        "https://www.plug.tech/cdn/shop/files/factoryunlockedre_ba6016ff-cc16-4f79-b1cb-bf558065efd4.jpg?v=1726846786&width=823",
        "https://www.plug.tech/cdn/shop/files/iPhone15Pink_Back.png?v=1714075690&width=823",
    ];
    const [currentImage, setCurrentImage] = useState(MOCK_IMAGES[0]);
    return (
        <>
            <div className="bg-background flex min-h-screen w-full flex-col items-center justify-center">
                <section className="container w-full max-w-7xl px-4 py-8">
                    <div className="grid w-full grid-cols-2">
                        <div className="flex flex-col">
                            <div className="flex flex-col items-center">
                                <div className="relative h-[500px] w-full">
                                    <Image
                                        src={currentImage}
                                        alt={"phone"}
                                        fill
                                        className="group-hover:opacity-0"
                                    />
                                </div>
                                <ScrollArea className="white-space-nowrap mt-8 w-5/6">
                                    <div className="mx-4 mb-2 flex flex-row gap-3">
                                        {MOCK_IMAGES.map((item) => (
                                            <div
                                                className="border-secondary/50 hover:border-secondary relative h-24 w-24 shrink-0 cursor-pointer rounded-2xl border p-2"
                                                key={item}
                                                onClick={() =>
                                                    setCurrentImage(item)
                                                }
                                            >
                                                <Image
                                                    key={item}
                                                    src={item}
                                                    alt={"phone"}
                                                    fill
                                                    className="rounded-2xl p-2"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <ScrollBar orientation="horizontal" />
                                </ScrollArea>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <ScrollArea className="h-[624px] w-full space-y-2 pl-16">
                                <div className="mr-8 flex flex-col">
                                    <Label className="w-fit rounded-md bg-linear-to-tl from-[#fde68a] to-[#f59e0b] px-4 py-1.5 text-sm font-bold text-black uppercase">
                                        Sales
                                    </Label>
                                    <div className="my-4 flex flex-row items-center justify-between">
                                        <div className="text-secondary font-semibold">
                                            Apple
                                        </div>
                                        <div>
                                            <Star className="inline-block h-4 w-4 text-blue-400" />
                                            <span className="text-secondary-dark mx-1 font-medium">
                                                4.8
                                            </span>
                                            <span className="text-secondary-dark font-medium">{`(${reviews})`}</span>
                                        </div>
                                    </div>
                                    <span className="text-3xl font-bold">
                                        iPhone 15 Pink 128GB (Unlocked)
                                    </span>
                                    <div className="mt-2 flex flex-row items-center space-x-2">
                                        <span className="text-lg font-semibold">
                                            13.824.000 VND
                                        </span>
                                        <span className="text-secondary text-xs line-through">
                                            28.053.000 VND
                                        </span>
                                        <Label className="w-fit rounded-2xl bg-linear-to-tl from-[#fde68a] to-[#f59e0b] px-4 py-1 text-sm font-bold text-black uppercase">
                                            Sales 46%
                                        </Label>
                                    </div>
                                    <Button className="bg-info-dark hover:bg-info mt-8 rounded-3xl px-8">
                                        Add to Cart
                                    </Button>
                                    <Separator className="my-10" />
                                    <span className="text-3xl font-bold">
                                        Select color
                                    </span>
                                    <div className="mt-4 flex w-full gap-2 text-start">
                                        {[
                                            "bg-primary",
                                            "bg-secondary",
                                            "bg-success",
                                        ].map((color) => (
                                            <Button
                                                key={color}
                                                className={`h-10 w-10 rounded-full border-2 bg-white p-0 px-0 py-0 font-semibold hover:border-green-400 hover:bg-transparent hover:shadow-md`}
                                            >
                                                <div
                                                    className={`${color} h-4 rounded-full p-4 font-semibold text-white`}
                                                ></div>
                                            </Button>
                                        ))}
                                    </div>
                                    <Separator className="my-10" />
                                    <span className="text-3xl font-bold">
                                        Select Storage
                                    </span>
                                    <div className="flex w-full flex-row gap-4">
                                        {["128GB", "256GB", "512GB"].map(
                                            (storage) => (
                                                <Button
                                                    key={storage}
                                                    className={`text-secondary-dark hover:border-secondary mt-4 h-12 w-32 rounded-2xl border-2 bg-transparent p-0 px-0 py-0 font-semibold hover:bg-transparent hover:shadow-md`}
                                                >
                                                    {storage}
                                                </Button>
                                            )
                                        )}
                                    </div>
                                    <Separator className="my-10" />
                                    <div className="flex flex-row items-center justify-between">
                                        <span className="text-3xl font-bold">
                                            Select Condition
                                        </span>
                                        <span className="cursor-pointer text-xl font-medium text-yellow-700 underline hover:text-yellow-500">
                                            Learn more
                                        </span>
                                    </div>
                                    {[
                                        {
                                            label: "Ecofriendly",
                                            price: "13.148.000₫",
                                        },
                                        {
                                            label: "Good",
                                            price: "13.148.000₫",
                                        },
                                        {
                                            label: "Excellent",
                                            price: "13.148.000₫",
                                        },
                                    ].map((storage) => (
                                        <Button
                                            key={storage.label}
                                            className={`text-secondary-dark hover:border-secondary mt-4 flex h-12 w-full cursor-pointer flex-row items-center justify-between rounded-2xl border-2 bg-transparent px-4 font-semibold hover:bg-transparent hover:shadow-md`}
                                        >
                                            <span>{storage.label}</span>
                                            <span>{storage.price}</span>
                                        </Button>
                                    ))}
                                    <Separator className="my-10" />
                                    <div className="border-secondary rounded-2xl border bg-gray-50 p-6 dark:bg-transparent">
                                        <Label className="w-fit rounded-md bg-linear-to-tl from-[#fde68a] to-[#f59e0b] px-4 py-1.5 text-sm font-bold text-black uppercase">
                                            Sales
                                        </Label>

                                        <span className="text-3xl font-bold">
                                            iPhone 15 Pink 128GB (Unlocked)
                                        </span>
                                        <div className="mt-2 flex flex-row items-center space-x-2">
                                            <span className="text-lg font-semibold">
                                                13.824.000 VND
                                            </span>
                                            <span className="text-secondary text-xs line-through">
                                                28.053.000 VND
                                            </span>
                                            <Label className="w-fit rounded-2xl bg-linear-to-tl from-[#fde68a] to-[#f59e0b] px-4 py-1 text-sm font-bold text-black uppercase">
                                                Sales 46%
                                            </Label>
                                        </div>
                                        <Button className="bg-info-dark hover:bg-info mt-8 mb-6 w-full rounded-3xl px-8">
                                            Add to Cart
                                        </Button>
                                        <Separator className="mt-8" />
                                        <Accordion
                                            type="single"
                                            collapsible
                                            className="w-full"
                                        >
                                            <AccordionItem
                                                value="1"
                                                className="border-b border-slate-200"
                                            >
                                                <AccordionTrigger className="text-left text-sm font-semibold text-slate-900 hover:no-underline md:text-lg">
                                                    Description
                                                </AccordionTrigger>
                                                <AccordionContent className="pb-6 text-sm leading-relaxed text-slate-600">
                                                    The only difference between
                                                    our plug refurbished Apple
                                                    iPhone 15 and a brand new
                                                    one is the price. Our iPhone
                                                    15 are up to 40% more
                                                    affordable and are backed by
                                                    our plug 1-year warranty. To
                                                    ensure our products meet our
                                                    incredibly high-performance
                                                    standards, we’ve developed a
                                                    proprietary 90+ point
                                                    functionality evaluation,
                                                    deep cleaning, and
                                                    sanitization process.
                                                    Specialized technicians at
                                                    our company’s headquarters
                                                    hand test each device, and
                                                    only products that pass our
                                                    rigorous testing receive
                                                    plug’s Certified Pre-Owned
                                                    status and are sold.
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <Separator className="mb-8" />
                                        <div className="flex items-center gap-3">
                                            <div className="bg-secondary rounded-full">
                                                <ShieldCheck className="h-8 w-8 p-2 text-white" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold">
                                                    12-Month-Warranty
                                                </span>
                                                <span className="text-secondary-dark mt-1 text-xs">
                                                    We're so confident in our
                                                    tech, we back everything
                                                    with a 1-year warranty.
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="bg-secondary rounded-full">
                                                <Heart className="h-8 w-8 p-2 text-white" />
                                            </div>
                                            <div className="mt-4 flex flex-col">
                                                <span className="text-sm font-semibold">
                                                    Extended Holiday Returns
                                                </span>
                                                <span className="text-secondary-dark mt-1 text-xs">
                                                    Order now and get extended
                                                    returns until Jan 15 —
                                                    because the holidays
                                                    shouldn't be stressful.
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-secondary mt-8 rounded-2xl border bg-gray-50 p-6 dark:bg-transparent">
                                        <div className="p-2 font-semibold">
                                            Tech Specifications
                                        </div>
                                        <Separator className="my-4" />
                                        {[1, 2, 3, 4, 5].map((spec) => (
                                            <div
                                                key={spec}
                                                className="mt-2 grid grid-cols-2 gap-x-8 gap-y-4"
                                            >
                                                <div className="flex flex-col font-semibold">
                                                    Model
                                                </div>
                                                <div className="flex flex-col">
                                                    iPhone 15
                                                </div>
                                                <Separator className="col-span-2 my-2" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <ScrollBar orientation="vertical" />
                            </ScrollArea>
                        </div>
                    </div>
                </section>
                <ProductAboutUs />
            </div>
            <HomeSaleProducts />
            <ProductReviews />
        </>
    );
}

export default ProductDetails;
