"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    FileText,
    ShieldCheck,
    UserCircle,
    Coins,
    Lock,
    RefreshCcw,
    HelpCircle,
    CheckCircle2,
    ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TERMS_SECTIONS = [
    {
        id: 1,
        title: "Chấp nhận điều khoản",
        icon: CheckCircle2,
        content:
            "Bằng cách truy cập và sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản này. Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng ngừng sử dụng dịch vụ ngay lập tức.",
        gradient: "from-blue-500 to-cyan-400",
    },
    {
        id: 2,
        title: "Tài khoản người dùng",
        icon: UserCircle,
        content:
            "Bạn có trách nhiệm bảo mật thông tin đăng nhập và mật khẩu của mình. Mọi hoạt động xảy ra dưới tài khoản của bạn sẽ do bạn chịu trách nhiệm hoàn toàn. Chúng tôi có quyền tạm khóa tài khoản nếu phát hiện dấu hiệu vi phạm bảo mật.",
        gradient: "from-indigo-500 to-purple-400",
    },
    {
        id: 3,
        title: "Quy định tích lũy điểm",
        icon: Coins,
        content:
            "Hệ thống tích điểm dựa trên giá trị đơn hàng thực tế sau khi đã trừ các khuyến mãi. Điểm thưởng không có giá trị quy đổi thành tiền mặt và có thời hạn sử dụng theo quy định của từng hạng thành viên.",
        gradient: "from-amber-500 to-orange-400",
    },
    {
        id: 4,
        title: "Chính sách bảo mật",
        icon: Lock,
        content:
            "Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Thông tin địa chỉ và số điện thoại chỉ được sử dụng cho mục đích giao hàng và hỗ trợ khách hàng theo chuẩn an toàn quốc tế.",
        gradient: "from-emerald-500 to-teal-400",
    },
    {
        id: 5,
        title: "Thay đổi điều khoản",
        icon: RefreshCcw,
        content:
            "Chúng tôi có quyền cập nhật các điều khoản này bất cứ lúc nào mà không cần thông báo trước. Việc bạn tiếp tục sử dụng dịch vụ đồng nghĩa với việc chấp nhận các thay đổi đó.",
        gradient: "from-rose-500 to-pink-400",
    },
];

export default function TermsAndConditions() {
    const lastUpdated = "21/01/2026";

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* HERO SECTION - TIÊU ĐỀ RỰC RỠ */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-900 px-4 py-24">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="relative z-10 container mx-auto max-w-4xl space-y-6 text-center">
                    <Badge className="border border-white/20 bg-white/10 px-6 py-1.5 text-indigo-100 backdrop-blur-xl hover:bg-white/20">
                        Văn bản pháp lý chính thức
                    </Badge>
                    <h1 className="text-4xl font-black tracking-tighter text-white uppercase md:text-6xl">
                        Điều khoản{" "}
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            &
                        </span>{" "}
                        Dịch vụ
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg leading-relaxed font-medium text-slate-300 md:text-xl">
                        Quy định rõ ràng về quyền lợi và trách nhiệm giúp xây
                        dựng một cộng đồng mua sắm văn minh, minh bạch.
                    </p>
                    <div className="flex items-center justify-center gap-3 text-sm font-semibold tracking-wider text-slate-400 uppercase">
                        <FileText className="size-4 text-cyan-400" /> Cập nhật
                        lần cuối: {lastUpdated}
                    </div>
                </div>

                {/* DECORATIVE LIGHTS */}
                <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-500/20 blur-[120px]"></div>
                <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-purple-500/20 blur-[120px]"></div>
            </div>

            <div className="relative z-20 container mx-auto -mt-16 max-w-5xl px-4">
                <Card className="overflow-hidden rounded-[2rem] border-none bg-white/90 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] backdrop-blur-2xl">
                    <CardContent className="p-0">
                        <ScrollArea className="h-[800px] w-full">
                            <div className="space-y-12 p-8 md:p-16">
                                <div className="grid grid-cols-1 gap-8">
                                    {TERMS_SECTIONS.map((section) => (
                                        <section
                                            key={section.id}
                                            className="group relative rounded-[1.5rem] border border-slate-100 bg-white p-8 transition-all duration-500 hover:border-transparent hover:shadow-2xl hover:shadow-indigo-500/10"
                                        >
                                            <div
                                                className={`absolute top-0 left-0 h-full w-2 rounded-l-[1.5rem] bg-gradient-to-b ${section.gradient}`}
                                            ></div>

                                            <div className="flex flex-col items-start gap-6 md:flex-row">
                                                <div
                                                    className={`h-14 w-14 flex-shrink-0 rounded-2xl bg-gradient-to-br ${section.gradient} flex items-center justify-center text-white shadow-lg shadow-indigo-200 transition-transform duration-500 group-hover:scale-110`}
                                                >
                                                    <section.icon className="size-7" />
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs font-black tracking-widest text-slate-300 uppercase">
                                                            Mục {section.id}
                                                        </span>
                                                        <h3 className="text-2xl leading-none font-extrabold text-slate-800">
                                                            {section.title}
                                                        </h3>
                                                    </div>
                                                    <p className="leading-relaxed font-medium text-slate-600">
                                                        {section.content}
                                                    </p>
                                                </div>
                                            </div>
                                        </section>
                                    ))}
                                </div>

                                {/* FOOTER SECTION */}
                                <div className="mt-16 border-t border-slate-100 pt-10">
                                    <div className="flex flex-col items-center justify-between gap-8 rounded-3xl bg-gradient-to-r from-slate-50 to-indigo-50/30 p-8 md:flex-row">
                                        <div className="space-y-2 text-center md:text-left">
                                            <h4 className="flex items-center justify-center gap-2 text-xl font-bold text-slate-900 md:justify-start">
                                                <HelpCircle className="size-6 text-indigo-500" />
                                                Bạn cần hỗ trợ thêm?
                                            </h4>
                                            <p className="max-w-sm text-sm text-slate-500">
                                                Nếu có bất kỳ thắc mắc nào về
                                                điều khoản dịch vụ, đội ngũ hỗ
                                                trợ của chúng tôi luôn sẵn sàng
                                                lắng nghe.
                                            </p>
                                        </div>
                                        <button className="group flex items-center gap-2 rounded-2xl bg-slate-900 px-8 py-4 text-sm font-bold text-white shadow-xl transition-all duration-300 hover:bg-indigo-600 active:scale-95">
                                            Liên hệ Trung tâm hỗ trợ
                                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                        </button>
                                    </div>

                                    <div className="mt-12 flex justify-center gap-8 opacity-20">
                                        <ShieldCheck className="size-16 text-slate-900" />
                                        <FileText className="size-16 text-slate-900" />
                                    </div>
                                    <p className="mt-8 text-center text-[10px] tracking-[0.2em] text-slate-400 uppercase">
                                        &copy; 2026 T7M Online Store - All
                                        Rights Reserved
                                    </p>
                                </div>
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
