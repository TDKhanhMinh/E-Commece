"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Mail, Phone, Facebook, MessageCircle } from "lucide-react";

export default function HelpCenter() {
    const sections = [
        {
            title: "Về Chúng tôi",
            questions: [
                "Tại sao tôi không đổi được điểm tích lũy?",
                "Tôi có thể tích điểm như thế nào?",
            ],
        },
        {
            title: "Chính sách",
            questions: [
                "Tôi có thể sử dụng hóa đơn chưa tích điểm để tích điểm cho thành viên được không?",
                "Khi đặt hàng qua hotline 18006779, tôi có thể áp dụng Thành viên hay không?",
            ],
        },
    ];

    return (
        <div className="mx-auto max-w-6xl space-y-0 p-4">
            <Card className="overflow-hidden border-none shadow-sm">
                <div className="space-y-4 bg-green-600 p-8">
                    <div className="text-white">
                        <h2 className="text-lg font-medium">
                            Xin chào Trần Đỗ Khánh Minh
                        </h2>
                        <p className="text-sm opacity-90">
                            Chúng tôi giúp được gì cho bạn
                        </p>
                    </div>
                    <div className="relative max-w-5xl">
                        <Input
                            className="h-12 w-full rounded-full border-none bg-white pr-10 pl-4 text-gray-800 placeholder:text-gray-400"
                            placeholder="Nhập câu hỏi, từ khoá..."
                        />
                        <Search className="absolute top-1/2 right-4 size-5 -translate-y-1/2 text-blue-500" />
                    </div>
                </div>

                <CardContent className="space-y-8 bg-white p-8">
                    {sections.map((section, idx) => (
                        <div key={idx} className="space-y-4">
                            <h3 className="0 text-lg font-bold">
                                {section.title}
                            </h3>
                            <div className="grid grid-cols-1 gap-x-12 gap-y-4 border-t pt-4 md:grid-cols-2">
                                {section.questions.map((q, qIdx) => (
                                    <div
                                        key={qIdx}
                                        className="group flex cursor-pointer items-center justify-between border-b pb-4 md:border-b-0 md:pb-0"
                                    >
                                        <span className="text-sm text-gray-700 transition-colors group-hover:text-green-600">
                                            {q}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            ›
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="space-y-4 pt-4">
                        <h3 className="text-lg font-bold">Liên hệ hỗ trợ</h3>
                        <div className="grid grid-cols-1 gap-6 border-t pt-4 md:grid-cols-2">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <Mail className="size-4 text-blue-500" />
                                    <span>customerservice@t7m.kmgroup.com</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <Phone className="size-4 text-green-600" />
                                    <span>1900234518 (Ext.01)</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <Facebook className="size-4 text-blue-600" />
                                    <span className="truncate">
                                        https://m.me/t7mshop
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <MessageCircle className="size-4 text-blue-400" />
                                    <span className="truncate">
                                        https://zalo.me/3547667082335355338
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
