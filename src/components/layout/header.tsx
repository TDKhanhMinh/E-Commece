"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingCart, Search, Menu, Moon, Sun, User, X } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "../ui/drawer";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../ui/sheet";

export default function Header() {
    const { setTheme } = useTheme();
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const changeLocale = (nextLocale: string) => {
        const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
        router.push(newPath);
    };

    return (
        <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
            <Sheet>
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-8">
                        <Link
                            href="/"
                            className="text-primary text-xl font-bold tracking-tighter"
                        >
                            T7M ONLINE
                        </Link>

                        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
                            <Link
                                href="/products"
                                className="hover:text-primary transition-colors"
                            >
                                Sản phẩm
                            </Link>
                            <Link
                                href="/categories"
                                className="hover:text-primary transition-colors"
                            >
                                Danh mục
                            </Link>
                            <Link
                                href="/deals"
                                className="hover:text-primary transition-colors"
                            >
                                Khuyến mãi
                            </Link>
                        </nav>
                    </div>

                    <div className="relative hidden w-full max-w-sm items-center lg:flex">
                        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                        <Input
                            type="search"
                            placeholder="Tìm kiếm sản phẩm..."
                            className="bg-muted/50 focus-visible:ring-primary rounded-full pl-9"
                        />
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
                                <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px]">
                                    0
                                </span>
                            </Button>
                        </SheetTrigger>

                        <Link href="/login" className="hidden md:block">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <User className="h-4 w-4" />
                                Đăng nhập
                            </Button>
                        </Link>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
                <SheetContent className="h-full w-full p-4">
                    <SheetTitle>Your Cart</SheetTitle>
                    <div className="flex h-full flex-col items-center justify-center">
                        <div className="flex flex-col items-center justify-center p-4">
                            <ShoppingCart className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                            <span className="text-muted-foreground text-sm">
                                No item in your cart.
                            </span>
                            <p className="text-center">
                                Your cart's still waiting for its first gadget.
                                Find your next device in just a few clicks.
                            </p>
                            <Button className="bg-info-darker hover:bg-info mt-4 rounded-2xl">
                                Shop now
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </header>
    );
}
