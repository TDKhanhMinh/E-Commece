"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Moon, ShoppingCart, Sun, User } from "lucide-react";
import { SheetTrigger } from "../ui/sheet";
import { UserAvatar } from "@/components/common";
import { NotificationDropdown } from "./notification-dropdown";
import { useTranslations } from "next-intl";

interface HeaderActionsProps {
    locale: string;
    changeLocale: (nextLocale: string) => void;
    setTheme: (theme: string) => void;
    itemCount?: number;
    isAuthenticated: boolean;
    showCart?: boolean;
    showMobileMenu?: boolean;
}

export function HeaderActions({
    locale,
    changeLocale,
    setTheme,
    itemCount = 0,
    isAuthenticated,
    showCart = true,
    showMobileMenu = true,
}: HeaderActionsProps) {
    const t = useTranslations("common");
    return (
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
                            {locale === "vi" ? "🇻🇳" : locale === "en" ? "🇺🇸" : "🇨🇳"}
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
                        <DropdownMenuItem
                            onClick={() => changeLocale("zh")}
                        >
                            中文
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={() => setTheme("light")}
                    >
                        {t("themes.light")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setTheme("dark")}
                    >
                        {t("themes.dark")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setTheme("system")}
                    >
                        {t("themes.system")}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {showCart && (
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
            )}

            {isAuthenticated ? (
                <>
                    <NotificationDropdown />
                    <UserAvatar />
                </>
            ) : (
                <Link href="/login" className="hidden md:block">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                    >
                        <User className="h-4 w-4" />
                        {t("auth.login.title")}
                    </Button>
                </Link>
            )}

            {showMobileMenu && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                >
                    <Menu className="h-6 w-6" />
                </Button>
            )}
        </div>
    );
}
