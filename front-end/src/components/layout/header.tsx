"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Moon, ShoppingCart, Sun, User } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Sheet, SheetTrigger } from "../ui/sheet";
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
import { UserAvatar } from "@/components/common";
import { CartSheet } from "../common/cart/cart-sheet";
import { useCartSummary } from "@/hooks/use-cart";
import { GlobalSearch } from "@/components/common/ui/search-input";

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
                <div className="mx-8 flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-8">
                        <Link
                            href="/"
                            className="text-primary text-xl font-bold tracking-tighter"
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
                                        <div className="mx-auto max-w-7xl px-6">
                                            <div className="grid w-250 grid-cols-[250px_1fr] gap-6 p-6">
                                                <div className="space-y-2">
                                                    <p className="text-muted-foreground text-xs uppercase">
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
                                                                className="hover:text-primary block py-1 text-sm font-medium"
                                                            >
                                                                {item}
                                                            </Link>
                                                        </NavigationMenuLink>
                                                    ))}
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="flex flex-col justify-between rounded-2xl bg-linear-to-br from-emerald-50 to-lime-200 p-6">
                                                        <div>
                                                            <p className="text-primary text-xs font-semibold">
                                                                FROM $119
                                                            </p>
                                                            <h3 className="mt-2 text-xl font-bold">
                                                                Give the Gift of
                                                                iPhone
                                                            </h3>
                                                            <p className="text-muted-foreground mt-2 text-sm">
                                                                Make their
                                                                season shine
                                                                with premium
                                                                preowned
                                                                iPhones.
                                                            </p>
                                                        </div>
                                                        <Image
                                                            src="https://www.plug.tech/cdn/shop/files/PLUG_MM_SAMSUNG_ALL_IPHONES.webp?v=1763397440&width=800"
                                                            alt="iPhones"
                                                            width={260}
                                                            height={180}
                                                            className="mx-auto"
                                                        />
                                                    </div>

                                                    <div className="flex flex-col justify-between rounded-2xl bg-linear-to-br from-slate-50 to-lime-200 p-6">
                                                        <div>
                                                            <p className="text-xs font-semibold">
                                                                PLUG EXCLUSIVE
                                                            </p>
                                                            <h3 className="mt-2 text-xl font-bold">
                                                                iPhone Starter
                                                                Pack
                                                            </h3>
                                                            <p className="text-muted-foreground mt-2 text-sm">
                                                                Everything they
                                                                need, all in one
                                                                bundle.
                                                            </p>
                                                        </div>
                                                        <Image
                                                            src="https://www.plug.tech/cdn/shop/files/PLUG_MM_IPHONES_STARTER_PACK.webp?v=1763397606&width=800"
                                                            alt="Starter Pack"
                                                            width={220}
                                                            height={180}
                                                            className="mx-auto"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="relative hidden w-full max-w-sm items-center lg:flex">
                        <GlobalSearch />
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full"
                                >
                                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full text-lg"
                                    >
                                        {locale === "vi" ? "🇻🇳" : "🇺🇸"}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        onClick={() => changeLocale("vi")}
                                    >
                                        Tiếng Việt
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => changeLocale("en")}
                                    >
                                        English
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => setTheme("light")}
                                >
                                    Sáng
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setTheme("dark")}
                                >
                                    Tối
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setTheme("system")}
                                >
                                    Hệ thống
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative rounded-full"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                {itemCount > 0 && (
                                    <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px]">
                                        {itemCount > 99 ? "99+" : itemCount}
                                    </span>
                                )}
                            </Button>
                        </SheetTrigger>

                        {isAuthenticated ? (
                            <UserAvatar />
                        ) : (
                            <Link href="/login" className="hidden md:block">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-2"
                                >
                                    <User className="h-4 w-4" />
                                    Đăng nhập
                                </Button>
                            </Link>
                        )}

                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
                <CartSheet />
            </Sheet>
        </header>
    );
}
