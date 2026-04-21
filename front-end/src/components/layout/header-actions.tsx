"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, ChevronDown, Menu, Moon, ShoppingCart, Sun, User } from "lucide-react";
import { SheetTrigger } from "../ui/sheet";
import { UserAvatar } from "@/components/common";
import { NotificationDropdown, NotificationContent } from "./notification-dropdown";
import { useTranslations } from "next-intl";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

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
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    return (
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2 md:gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>{t("themes.light")}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>{t("themes.dark")}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>{t("themes.system")}</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-lg">
                            {locale === "vi" ? "🇻🇳" : locale === "en" ? "🇺🇸" : "🇨🇳"}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => changeLocale("vi")}>Tiếng Việt</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeLocale("en")}>English</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeLocale("zh")}>中文</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {isAuthenticated ? (
                    <>
                        <NotificationDropdown />
                        <UserAvatar />
                    </>
                ) : (
                    <Link href="/login">
                        <Button variant="ghost" size="sm" className="gap-2 h-10 px-3">
                            <User className="h-4 w-4" />
                            <span className="hidden lg:inline">{t("auth.login.title")}</span>
                        </Button>
                    </Link>
                )}
            </div>

            {/* Mobile Actions Grouped */}
            <div className="flex md:hidden items-center gap-1">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full">
                            <Menu className="h-5 w-5" />
                            {/* We could add a badge here if there are notifications, but we'd need to lift the unreadCount state */}
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[240px] p-2">
                        {isAuthenticated ? (
                            <>
                                <div className="flex items-center gap-2 p-2 mb-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                    <UserAvatar />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold">User Account</span>
                                        <Link href="/user/profile" className="text-xs text-primary hover:underline">View Profile</Link>
                                    </div>
                                </div>
                                <Collapsible open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen} className="w-full">
                                    <CollapsibleTrigger asChild>
                                        <DropdownMenuItem 
                                            className="flex items-center justify-between gap-2 p-2 cursor-pointer focus:bg-accent focus:text-accent-foreground"
                                            onSelect={(e) => e.preventDefault()}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Bell className="h-4 w-4" />
                                                <span className="text-sm">Notifications</span>
                                            </div>
                                            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isNotificationsOpen ? "rotate-180" : ""}`} />
                                        </DropdownMenuItem>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="w-full overflow-hidden">
                                        <div className="border-t border-b bg-slate-50/50 dark:bg-slate-900/50">
                                            <NotificationContent />
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                                <DropdownMenuSeparator />
                            </>
                        ) : (
                            <DropdownMenuItem asChild>
                                <Link href="/login" className="flex items-center gap-2 mb-2 bg-primary text-primary-foreground font-medium p-2 rounded-md justify-center w-full">
                                    <User className="h-4 w-4" />
                                    {t("auth.login.title")}
                                </Link>
                            </DropdownMenuItem>
                        )}
                        
                        <div className="space-y-3 py-2">
                            <div className="px-2">
                                <p className="text-xs font-medium text-muted-foreground mb-2">Language</p>
                                <div className="grid grid-cols-3 gap-2">
                                    <Button variant="outline" size="sm" onClick={() => changeLocale("vi")} className={locale === "vi" ? "border-primary bg-primary/5" : ""}>🇻🇳</Button>
                                    <Button variant="outline" size="sm" onClick={() => changeLocale("en")} className={locale === "en" ? "border-primary bg-primary/5" : ""}>🇺🇸</Button>
                                    <Button variant="outline" size="sm" onClick={() => changeLocale("zh")} className={locale === "zh" ? "border-primary bg-primary/5" : ""}>🇨🇳</Button>
                                </div>
                            </div>

                            <div className="px-2">
                                <p className="text-xs font-medium text-muted-foreground mb-2">Theme</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => setTheme("light")} 
                                        className="gap-2"
                                    >
                                        <Sun className="h-4 w-4" />
                                        Light
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => setTheme("dark")} 
                                        className="gap-2"
                                    >
                                        <Moon className="h-4 w-4" />
                                        Dark
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Primary Action: Cart (Always visible) */}
            {showCart && (
                <SheetTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative h-10 w-10 rounded-full"
                    >
                        <ShoppingCart className="h-5 w-5" />
                        {itemCount > 0 && (
                            <span className="bg-primary text-primary-foreground absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold">
                                {itemCount > 99 ? "99+" : itemCount}
                            </span>
                        )}
                        <span className="sr-only">Cart</span>
                    </Button>
                </SheetTrigger>
            )}
        </div>

    );
}
