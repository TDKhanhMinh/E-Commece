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

export default function Footer() {
    return (
        <footer className="w-full border-t bg-zinc-50 dark:bg-zinc-950">
            <div className="container mx-auto px-4 py-3 md:py-4">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold tracking-tighter">
                            T7M ONLINE
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Cung cấp các sản phẩm công nghệ và phụ kiện cao cấp
                            nhất. Chúng tôi cam kết mang lại trải nghiệm mua sắm
                            tuyệt vời cho khách hàng;
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
                            Khám phá
                        </h4>
                        <ul className="text-muted-foreground space-y-2 text-sm">
                            <li>
                                <Link href="/" className="hover:text-primary">
                                    Trang chủ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/products"
                                    className="hover:text-primary"
                                >
                                    Tất cả sản phẩm
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/categories"
                                    className="hover:text-primary"
                                >
                                    Danh mục
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/blog"
                                    className="hover:text-primary"
                                >
                                    Tin tức công nghệ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 text-sm font-semibold tracking-wider uppercase">
                            Hỗ trợ
                        </h4>
                        <ul className="text-muted-foreground space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/faq"
                                    className="hover:text-primary"
                                >
                                    Câu hỏi thường gặp
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/shipping"
                                    className="hover:text-primary"
                                >
                                    Chính sách giao hàng
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/privacy"
                                    className="hover:text-primary"
                                >
                                    Chính sách bảo mật
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    className="hover:text-primary"
                                >
                                    Điều khoản dịch vụ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 text-sm font-semibold tracking-wider uppercase">
                            Liên hệ
                        </h4>
                        <ul className="text-muted-foreground space-y-3 text-sm">
                            <li className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> Quận 7, TP. Hồ
                                Chí Minh
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
                        © 2026 T7M Online. Built for TRAN DO KHANH MINH project
                    </p>
                </div>
            </div>
        </footer>
    );
}
