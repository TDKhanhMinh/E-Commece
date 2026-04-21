"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { HeaderActions } from "./header-actions";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Sheet } from "../ui/sheet";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "../ui/navigation-menu";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import { CartSheet } from "../common/cart/cart-sheet";
import { useCartSummary } from "@/hooks/use-cart";
import { GlobalSearch } from "@/components/common/ui/search-input";

function SidebarTriggerSafe() {
    try {
        // useSidebar will throw if not inside SidebarProvider
        const { state } = useSidebar();
        if (!state) return null;
        return <SidebarTrigger className="h-10 w-10" />;
    } catch (e) {
        return null;
    }
}

export default function Header() {
    const { setTheme } = useTheme();
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated } = useAuthStore();
    const { itemCount } = useCartSummary();

    const changeLocale = (nextLocale: string) => {
        const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
        router.push(newPath);
    };

    return (
        <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
            <Sheet>
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 md:gap-8">
                        <SidebarTriggerSafe />
                        <Link
                            href="/"
                            className="text-primary text-lg font-bold tracking-tighter sm:text-xl md:text-2xl"
                        >
                            T7M ONLINE
                        </Link>

                        <NavigationMenu className="hidden md:flex">
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="bg-transparent text-sm font-medium">
                                        iPhone
                                    </NavigationMenuTrigger>

                                    <NavigationMenuContent className="w-full rounded-none border-t">
                                        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
                                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 lg:block lg:space-y-2">
                                                    <p className="text-muted-foreground col-span-2 mb-2 text-xs font-semibold uppercase tracking-wider lg:col-span-1">
                                                        Explore iPhone
                                                    </p>

                                                    {[
                                                        "Explore All iPhones",
                                                        "iPhone Starter Packs",
                                                        "iPhone 16 Series",
                                                        "iPhone 15 Series",
                                                        "iPhone 14 Series",
                                                        "iPhone 13 Series",
                                                        "iPhone 12 Series",
                                                        "iPhone 11 Series",
                                                        "iPhone X Series",
                                                        "iPhone 8 & SE Series",
                                                    ].map((item) => (
                                                        <NavigationMenuLink
                                                            key={item}
                                                            asChild
                                                        >
                                                            <Link
                                                                href="/products"
                                                                className="hover:text-primary block py-1.5 text-sm font-medium transition-colors"
                                                            >
                                                                {item}
                                                            </Link>
                                                        </NavigationMenuLink>
                                                    ))}
                                                </div>

                                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                                    <div className="flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-lime-200 p-6 dark:from-emerald-950/20 dark:to-lime-900/20">
                                                        <div className="mb-4">
                                                            <p className="text-primary text-xs font-bold uppercase tracking-tight">
                                                                FROM $119
                                                            </p>
                                                            <h3 className="mt-2 text-xl font-bold leading-tight md:text-2xl">
                                                                Give the Gift of
                                                                iPhone
                                                            </h3>
                                                            <p className="text-muted-foreground mt-2 text-sm">
                                                                Make their
                                                                season shine
                                                                with premium
                                                                preowned.
                                                            </p>
                                                        </div>
                                                        <div className="relative aspect-[4/3] w-full">
                                                            <Image
                                                                src="https://www.plug.tech/cdn/shop/files/PLUG_MM_SAMSUNG_ALL_IPHONES.webp?v=1763397440&width=800"
                                                                alt="iPhones"
                                                                fill
                                                                className="object-contain"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-200 p-6 dark:from-slate-900/20 dark:to-indigo-900/20">
                                                        <div className="mb-4">
                                                            <p className="text-xs font-bold uppercase tracking-tight">
                                                                PLUG EXCLUSIVE
                                                            </p>
                                                            <h3 className="mt-2 text-xl font-bold leading-tight md:text-2xl">
                                                                iPhone Starter
                                                                Pack
                                                            </h3>
                                                            <p className="text-muted-foreground mt-2 text-sm">
                                                                Everything they
                                                                need, all in one
                                                                bundle.
                                                            </p>
                                                        </div>
                                                        <div className="relative aspect-[4/3] w-full">
                                                            <Image
                                                                src="https://www.plug.tech/cdn/shop/files/PLUG_MM_IPHONES_STARTER_PACK.webp?v=1763397606&width=800"
                                                                alt="Starter Pack"
                                                                fill
                                                                className="object-contain"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="relative mx-4 hidden w-full max-w-md items-center lg:flex">
                        <GlobalSearch />
                    </div>

                    <HeaderActions
                        locale={locale}
                        changeLocale={changeLocale}
                        setTheme={setTheme}
                        itemCount={itemCount}
                        isAuthenticated={isAuthenticated}
                    />
                </div>
                <CartSheet />
            </Sheet>
        </header>
    );
}
