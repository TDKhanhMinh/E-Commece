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

export default function Footer() {
    const t = useTranslations("footer");

    return (
        <footer className="w-full border-t bg-zinc-50 dark:bg-zinc-950">
            <div className="container mx-auto px-4 py-3 md:py-4">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold tracking-tighter">
                            T7M ONLINE
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            {t("description")}
                        </p>
                        <div className="flex gap-4">
                            <Facebook className="hover:text-primary h-5 w-5 cursor-pointer" />
                            <Instagram className="hover:text-primary h-5 w-5 cursor-pointer" />
                            <Twitter className="hover:text-primary h-5 w-5 cursor-pointer" />
                            <Youtube className="hover:text-primary h-5 w-5 cursor-pointer" />
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-4 text-sm font-semibold tracking-wider uppercase">
                            {t("explore.title")}
                        </h4>
                        <ul className="text-muted-foreground space-y-2 text-sm">
                            <li>
                                <Link href="/" className="hover:text-primary">
                                    {t("explore.home")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/products"
                                    className="hover:text-primary"
                                >
                                    {t("explore.allProducts")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/categories"
                                    className="hover:text-primary"
                                >
                                    {t("explore.categories")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/blog"
                                    className="hover:text-primary"
                                >
                                    {t("explore.news")}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 text-sm font-semibold tracking-wider uppercase">
                            {t("support.title")}
                        </h4>
                        <ul className="text-muted-foreground space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/faq"
                                    className="hover:text-primary"
                                >
                                    {t("support.faq")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/shipping"
                                    className="hover:text-primary"
                                >
                                    {t("support.shipping")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/privacy"
                                    className="hover:text-primary"
                                >
                                    {t("support.privacy")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    className="hover:text-primary"
                                >
                                    {t("support.terms")}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 text-sm font-semibold tracking-wider uppercase">
                            {t("contact.title")}
                        </h4>
                        <ul className="text-muted-foreground space-y-3 text-sm">
                            <li className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> {t("contact.address")}
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4" /> +84 123 456 789
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />{" "}
                                support@t7m-online.vn
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="text-muted-foreground mt-4 border-t text-center text-sm">
                    <p className="mt-3">
                        {t("copyright")}
                    </p>
                </div>
            </div>
        </footer>
    );
}
