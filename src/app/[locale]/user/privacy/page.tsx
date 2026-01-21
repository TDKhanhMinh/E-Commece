"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ShieldCheck, Eye, Database, Share2, Mail } from "lucide-react";

const DATA_COLLECTION = [
    {
        type: "Thông tin cá nhân",
        example: "Họ tên, SĐT, Email",
        purpose: "Xác thực & Hỗ trợ",
    },
    {
        type: "Thông tin giao hàng",
        example: "Địa chỉ, Tỉnh/Thành",
        purpose: "Vận chuyển",
    },
    {
        type: "Dữ liệu hệ thống",
        example: "IP, Thiết bị",
        purpose: "Bảo mật & UX",
    },
];

const USAGE_INFO = [
    {
        title: "Xử lý giao dịch",
        content: "Hoàn tất đơn hàng và tích lũy điểm thưởng thành viên.",
    },
    {
        title: "Thông báo",
        content:
            "Gửi cập nhật về tình trạng đơn hàng hoặc thay đổi quan trọng.",
    },
];

const SectionHeader = ({ icon: Icon, title }: { icon: any; title: string }) => (
    <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
        <Icon className="size-5" /> {title}
    </h3>
);

export default function PrivacyPolicy() {
    const lastUpdated = "21/01/2026";

    return (
        <div className="flex min-h-screen items-start justify-center bg-gray-50/30 p-4 pt-10">
            <Card className="w-full max-w-4xl border-none shadow-sm">
                <CardHeader className="bg-common-white sticky top-0 z-10 rounded-t-xl border-b">
                    <div className="mb-2 flex items-center gap-2">
                        <ShieldCheck className="size-6" />
                        <CardTitle className="text-2xl font-bold uppercase">
                            Chính sách bảo mật
                        </CardTitle>
                    </div>
                    <p className="text-secondary-dark text-sm">
                        Phiên bản hiệu lực từ ngày:{" "}
                        <span className="font-medium">{lastUpdated}</span>
                    </p>
                </CardHeader>

                <CardContent className="pt-8">
                    <ScrollArea className="h-[650px] pr-4">
                        <article className="text-secondary-dark space-y-10">
                            <p className="text-sm leading-relaxed">
                                Chúng tôi coi trọng sự riêng tư của bạn. Chính
                                sách này giải thích cách chúng tôi thu thập, sử
                                dụng và bảo vệ thông tin cá nhân của bạn khi bạn
                                sử dụng ứng dụng của chúng tôi.
                            </p>

                            <section>
                                <SectionHeader
                                    icon={Database}
                                    title="1. Dữ liệu chúng tôi thu thập"
                                />
                                <div className="overflow-hidden rounded-lg border">
                                    <Table>
                                        <TableHeader className="">
                                            <TableRow>
                                                <TableHead className="w-1/4 font-bold">
                                                    Loại dữ liệu
                                                </TableHead>
                                                <TableHead className="w-1/3 font-bold">
                                                    Ví dụ cụ thể
                                                </TableHead>
                                                <TableHead className="font-bold">
                                                    Mục đích
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {DATA_COLLECTION.map(
                                                (item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell className="font-medium">
                                                            {item.type}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.example}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.purpose}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </section>

                            <section>
                                <SectionHeader
                                    icon={Eye}
                                    title="2. Cách chúng tôi sử dụng thông tin"
                                />
                                <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {USAGE_INFO.map((item, index) => (
                                        <li
                                            key={index}
                                            className="rounded-lg border p-4 text-sm"
                                        >
                                            <strong>{item.title}:</strong>{" "}
                                            {item.content}
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section>
                                <SectionHeader
                                    icon={Share2}
                                    title="3. Chia sẻ dữ liệu với bên thứ ba"
                                />
                                <p className="text-justify text-sm">
                                    Chúng tôi <strong>không bán</strong> dữ liệu
                                    của bạn. Chúng tôi chỉ chia sẻ thông tin cần
                                    thiết (như Địa chỉ & SĐT) với các đối tác
                                    vận chuyển tin cậy để thực hiện việc giao
                                    hàng cho bạn.
                                </p>
                            </section>

                            <section className="rounded-r-md border-l-4 py-3 pl-4">
                                <h3 className="text-md mb-2 font-bold uppercase">
                                    Quyền của bạn
                                </h3>
                                <p className="text-sm">
                                    Bạn có quyền yêu cầu truy cập, chỉnh sửa
                                    hoặc xóa dữ liệu cá nhân của mình bất kỳ lúc
                                    nào thông qua phần{" "}
                                    <strong>Cài đặt tài khoản</strong> hoặc liên
                                    hệ với bộ phận hỗ trợ.
                                </p>
                            </section>

                            <footer className="space-y-2 border-t pt-6 text-center">
                                <p className="text-secondary-dark text-xs">
                                    Mọi thắc mắc về chính sách bảo mật vui lòng
                                    gửi về hòm thư:
                                </p>
                                <div className="flex cursor-pointer items-center justify-center gap-2 text-sm font-bold hover:underline">
                                    <Mail className="size-4" />
                                    <a href="mailto:privacy@t7m.kmgroup.com">
                                        privacy@t7m.kmgroup.com
                                    </a>
                                </div>
                            </footer>
                        </article>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
