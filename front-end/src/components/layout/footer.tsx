import Link from "next/link";
import {
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Mail,
    Phone,
    MapPin,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function Footer() {
    const t = useTranslations("footer");

    return (
        <footer className="w-full border-t bg-zinc-50 dark:bg-zinc-950">
            <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
                <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold tracking-tighter sm:text-2xl">
                            T7M ONLINE
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                            {t("description")}
                        </p>
                        <div className="flex gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800"
                                aria-label="Facebook"
                            >
                                <Facebook className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800"
                                aria-label="Twitter"
                            >
                                <Twitter className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800"
                                aria-label="Youtube"
                            >
                                <Youtube className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-6 text-sm font-semibold tracking-wider uppercase">
                            {t("explore.title")}
                        </h4>
                        <ul className="text-muted-foreground space-y-3 text-sm sm:text-base">
                            <li>
                                <Link
                                    href="/"
                                    className="hover:text-primary transition-colors"
                                >
                                    {t("explore.home")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/products"
                                    className="hover:text-primary transition-colors"
                                >
                                    {t("explore.allProducts")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/categories"
                                    className="hover:text-primary transition-colors"
                                >
                                    {t("explore.categories")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/blog"
                                    className="hover:text-primary transition-colors"
                                >
                                    {t("explore.news")}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-6 text-sm font-semibold tracking-wider uppercase">
                            {t("support.title")}
                        </h4>
                        <ul className="text-muted-foreground space-y-3 text-sm sm:text-base">
                            <li>
                                <Link
                                    href="/faq"
                                    className="hover:text-primary transition-colors"
                                >
                                    {t("support.faq")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/shipping"
                                    className="hover:text-primary transition-colors"
                                >
                                    {t("support.shipping")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/privacy"
                                    className="hover:text-primary transition-colors"
                                >
                                    {t("support.privacy")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    className="hover:text-primary transition-colors"
                                >
                                    {t("support.terms")}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-6 text-sm font-semibold tracking-wider uppercase">
                            {t("contact.title")}
                        </h4>
                        <ul className="text-muted-foreground space-y-4 text-sm sm:text-base">
                            <li className="flex items-start gap-3">
                                <MapPin className="mt-0.5 h-5 w-5 shrink-0" />
                                <span>{t("contact.address")}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 shrink-0" />
                                <span>+84 123 456 789</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 shrink-0" />
                                <span className="truncate">
                                    support@t7m-online.vn
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="text-muted-foreground mt-12 border-t pt-8 text-center text-sm sm:mt-16">
                    <p>{t("copyright")}</p>
                </div>
            </div>
        </footer>

    );
}
