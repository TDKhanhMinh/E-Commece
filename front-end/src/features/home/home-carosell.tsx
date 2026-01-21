"use client";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Laptop, Watch, Headphones, Tablet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import SimpleBar from "simplebar-react";
import { use } from "react";
import { useRouter } from "next/navigation";
import { MOCK_CAROUSEL_ITEMS } from "../../../mock";
export default function HomeCarousel() {
    const t = useTranslations("HomePage");
    const router = useRouter();
    return (
        <div className="flex flex-col gap-20 pb-20">
            <section className="bg-zinc-50 py-6 dark:bg-zinc-700/50">
                <div className="container mx-auto h-full px-4 text-center">
                    <div className="mx-auto mb-12 max-w-3xl">
                        <span className="mb-12 bg-gradient-to-r from-orange-500 via-indigo-500 to-green-500 bg-clip-text text-xl font-bold tracking-tighter text-transparent uppercase">
                            Trusted by Many, Loved by All
                        </span>
                        <h2 className="mt-0.5 font-bold uppercase md:text-4xl">
                            Explore our Top Tech
                        </h2>
                    </div>

                    <SimpleBar autoHide={true} style={{ maxWidth: "100%" }}>
                        <div className="flex flex-nowrap gap-6 px-4">
                            {MOCK_CAROUSEL_ITEMS.map((item) => (
                                <Card
                                    key={item.label}
                                    onClick={() =>
                                        router.push("/collection/" + item.label)
                                    }
                                    className="mb-5 flex w-2/6 shrink-0 cursor-pointer flex-col items-center gap-4 p-6 shadow-xl transition-transform hover:-translate-y-1"
                                >
                                    <Label className="rounded-md bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 px-3 py-1 text-lg font-semibold text-white uppercase">
                                        {item.label}
                                    </Label>

                                    <div className="text-center text-2xl font-bold">
                                        {item.title}
                                    </div>

                                    <Image
                                        className="h-full"
                                        src={item.imgUrl}
                                        alt={item.label}
                                        width={150}
                                        height={150}
                                    />
                                </Card>
                            ))}
                        </div>
                    </SimpleBar>
                </div>
            </section>
        </div>
    );
}
