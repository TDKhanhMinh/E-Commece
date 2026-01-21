import Subscribe from "@/components/common/subscribe";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import HomeCarousel from "@/features/home/home-carosell";
import HomeDeals from "@/features/home/home-deals";
import HomeFeedBack from "@/features/home/home-feedback";
import { HomeQuestions } from "@/features/home/home-questions";
import HomeSaleProducts from "@/features/home/home-sale-products";
import HomeWelcome from "@/features/home/home-welcome";
import Image from "next/image";

const PRODUCTS = [
    {
        id: 1,
        name: "Premium Wireless Headphones",
        price: 299,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
        category: "Electronics",
        rating: 4.8,
    },
    {
        id: 2,
        name: "Minimalist Leather Watch",
        price: 150,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
        category: "Accessories",
        rating: 4.5,
    },
    {
        id: 3,
        name: "Smart Fitness Tracker",
        price: 89,
        image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&q=80",
        category: "Health",
        rating: 4.2,
    },
    {
        id: 4,
        name: "Portable Bluetooth Speaker",
        price: 120,
        image: "https://images.unsplash.com/photo-1608156639585-34052e85a491?w=500&q=80",
        category: "Electronics",
        rating: 4.7,
    },
];

export default function Home() {
    return (
        <>
            <Header />
            <div className="flex min-h-screen flex-col font-sans">
                <section className="relative grid min-h-[60vh] grid-cols-2 items-center justify-center bg-linear-to-r from-emerald-50 via-stone-50 to-lime-200 px-6 py-20 text-center">
                    <div className="text-secondary-darker relative z-10 md:col-span-1 md:text-left">
                        <Badge className="mb-4 bg-linear-to-r from-purple-700 via-pink-500 to-orange-300 p-2 text-sm text-white uppercase">
                            Top Devices. Smart Prices.
                        </Badge>
                        <div className="text-secondary-darker mb-6 text-3xl font-extrabold tracking-tight uppercase sm:text-4xl lg:text-5xl">
                            Your next iPhone starts here!
                        </div>
                        <p className="text-secondary-darker mb-8 text-lg">
                            Shop premium iPhones from $119 certified by Plug,
                            built to perform, and backed with our 12-month
                            warranty you can count on.
                        </p>
                        <div className="text-white">
                            <Button
                                size="sm"
                                className="bg-info-darker hover:bg-info h-10 cursor-pointer rounded-full px-8"
                            >
                                Shop now
                            </Button>
                        </div>
                    </div>
                    <div className="relative left-[30%] h-full max-w-sm overflow-hidden md:col-span-1">
                        <Image
                            src="https://www.plug.tech/cdn/shop/files/PLUG_HERO_IPHONE.webp?v=1766781483&width=375%20375w,%20//www.plug.tech/cdn/shop/files/PLUG_HERO_IPHONE.webp?v=1766781483&width=550%20550w,%20//www.plug.tech/cdn/shop/files/PLUG_HERO_IPHONE.webp?v=1766781483&width=800%20800w"
                            alt="Hero Background"
                            fill
                            loading={"eager"}
                            className="object-cover"
                        />
                    </div>
                </section>

                <main className="container mx-auto px-4 py-20">
                    <HomeCarousel />
                    <HomeSaleProducts />
                    <HomeDeals />
                    <HomeWelcome />
                    <HomeFeedBack />
                    <HomeQuestions />
                </main>

                <Subscribe />
            </div>
            <Footer />
        </>
    );
}
