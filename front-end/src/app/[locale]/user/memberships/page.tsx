"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { USER_MEMBERSHIPS_TABS } from "../../../../../mock"; //
import { usePoints } from "@/hooks/use-point"; //
import { useAuthStore } from "@/store/useAuthStore"; //
import {
    ChevronRight,
    Clock,
    Crown,
    ShieldCheck,
    Star,
    TrendingDown,
    TrendingUp,
} from "lucide-react";
import { fDateTime } from "@/lib/format-date-time"; //
import { Badge } from "@/components/ui/badge";

const TIER_MAP: Record<string, string> = {
    MEMBER: "Thành viên",
    SILVER: "Hạng Bạc",
    GOLD: "Hạng Vàng",
    PLATINUM: "Bạch Kim",
}; //

const NEXT_TIER_MAP: Record<string, string> = {
    MEMBER: "Bạc",
    SILVER: "Vàng",
    GOLD: "Bạch Kim",
    PLATINUM: "Tối đa",
}; //

// Cấu hình màu sắc Gradient cho từng hạng
const TIER_STYLES: Record<string, string> = {
    MEMBER: "from-slate-400 to-slate-600",
    SILVER: "from-slate-300 via-slate-100 to-slate-400",
    GOLD: "from-amber-300 via-yellow-500 to-amber-600",
    PLATINUM: "from-indigo-400 via-cyan-400 to-blue-500",
};

export default function Membership() {
    const { user } = useAuthStore(); //
    const userId = user?.id ? parseInt(user.id) : 0; //
    const [page, setPage] = useState(0); //
    const size = 5; //

    const { useMyPointSummary, useMyPointHistory } = usePoints(); //

    const { data: summary, isLoading: isLoadingSummary } = useMyPointSummary(); //
    const { data: historyPage, isLoading: isLoadingHistory } =
        useMyPointHistory(userId, page, size); //

    const calculateProgress = () => {
        if (!summary) return 0; //
        if (summary.membershipTier === "PLATINUM") return 100; //
        const currentAcc = summary.totalAccumulatedPoints || 0; //
        const missing = summary.pointsToNextTier || 0; //
        const target = currentAcc + missing; //
        if (target === 0) return 0; //
        return (currentAcc / target) * 100; //
    };

    if (isLoadingSummary) {
        return (
            <div className="flex h-screen animate-pulse items-center justify-center font-bold text-slate-500 italic">
                Đang tải đặc quyền của bạn...
            </div>
        );
    }

    const tierCode = summary?.membershipTier || "MEMBER"; //
    const currentTierName = TIER_MAP[tierCode]; //
    const nextTierName = NEXT_TIER_MAP[tierCode]; //
    const isMaxTier = tierCode === "PLATINUM"; //
    const currentStyle = TIER_STYLES[tierCode];

    return (
        <div className="min-h-screen space-y-8 bg-slate-50/50 p-6 dark:bg-slate-950">
            {/* THẺ THÀNH VIÊN VIP - HERO SECTION */}
            <div
                className={`relative h-64 w-full rounded-[2.5rem] bg-linear-to-br ${currentStyle} group overflow-hidden p-8 shadow-2xl transition-all duration-700`}
            >
                {/* Hiệu ứng ánh kim chạy qua thẻ */}
                <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>

                <div className="relative z-10 flex h-full flex-col justify-between text-black">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <Badge className="border-none bg-white/50 text-[10px] tracking-[0.2em] text-black uppercase backdrop-blur-md">
                                Official Member
                            </Badge>
                            <h2 className="text-3xl font-black tracking-tighter uppercase italic">
                                {currentTierName}
                            </h2>
                        </div>
                        <Crown className="size-10 opacity-50" />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-end justify-between text-black">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase opacity-70">
                                    Điểm tích lũy hiện tại
                                </p>
                                <p className="text-4xl leading-none font-black tracking-tighter">
                                    {summary?.totalAccumulatedPoints?.toLocaleString(
                                        "vi-VN"
                                    ) || 0}
                                </p>
                            </div>
                            <div className="text-right text-black">
                                <p className="text-[10px] font-bold uppercase opacity-70">
                                    Chủ thẻ
                                </p>
                                <p className="font-bold tracking-widest uppercase italic">
                                    {user?.name || "Khách hàng"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Các vòng tròn trang trí ẩn hiện */}
                <div className="absolute -right-10 -bottom-10 size-48 rounded-full bg-white/10 blur-3xl"></div>
            </div>

            {/* GRID THÔNG TIN CHI TIẾT */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* ĐIỂM CÓ THỂ TIÊU (CURRENT POINTS) */}
                <Card className="group rounded-[2rem] border-none bg-white shadow-xl shadow-slate-200/50 transition-all duration-500 hover:shadow-2xl dark:bg-slate-900 dark:shadow-slate-950/50">
                    <CardContent className="flex h-full flex-col justify-between p-8">
                        <div className="space-y-4">
                            <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition-transform group-hover:scale-110 dark:bg-blue-900/30 dark:text-blue-400">
                                <Star className="size-6" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 italic dark:text-slate-100">
                                Điểm đổi quà
                            </h3>
                            <p className="text-sm leading-relaxed font-medium text-slate-500 dark:text-slate-400">
                                Bạn hiện có{" "}
                                <span className="ml-2 text-3xl font-black text-blue-600 dark:text-blue-400">
                                    {summary?.currentPoints?.toLocaleString(
                                        "vi-VN"
                                    ) || 0}
                                </span>{" "}
                                điểm
                            </p>
                        </div>
                        <Button className="mt-6 h-14 w-full cursor-pointer rounded-2xl bg-slate-900 font-black tracking-widest text-white uppercase shadow-xl shadow-blue-900/10 transition-all hover:bg-blue-600 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-blue-500 dark:hover:text-white">
                            Sử dụng ngay{" "}
                            <ChevronRight className="ml-2 size-4" />
                        </Button>
                    </CardContent>
                </Card>

                {/* TIẾN TRÌNH LÊN HẠNG */}
                <Card className="group rounded-[2rem] border-none bg-white shadow-xl shadow-slate-200/50 transition-all duration-500 hover:shadow-2xl dark:bg-slate-900 dark:shadow-slate-950/50">
                    <CardContent className="space-y-6 p-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black text-slate-800 italic dark:text-slate-100">
                                Tiến trình
                            </h3>
                            <ShieldCheck className="size-8 text-emerald-500" />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-xs font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                                <span>{currentTierName}</span>
                                <span>{nextTierName}</span>
                            </div>
                            <Progress
                                value={calculateProgress()} //
                                className="h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                            />
                            {!isMaxTier ? (
                                <p className="text-sm font-semibold text-slate-500 italic dark:text-slate-400">
                                    Tích lũy thêm{" "}
                                    <span className="font-black text-emerald-600 dark:text-emerald-400">
                                        {summary?.pointsToNextTier?.toLocaleString(
                                            "vi-VN"
                                        ) || 0}
                                    </span>{" "}
                                    điểm để nâng cấp!
                                </p>
                            ) : (
                                <p className="text-sm font-black text-emerald-600 uppercase italic dark:text-emerald-400">
                                    Đã đạt cấp độ tối đa! ✨
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* LỊCH SỬ BIẾN ĐỘNG ĐIỂM */}
            <Card className="overflow-hidden rounded-[2rem] border-none bg-white shadow-xl shadow-slate-200/50 dark:bg-slate-900 dark:shadow-slate-950/50">
                <CardHeader className="p-8 pb-4">
                    <CardTitle className="flex items-center gap-3 text-2xl font-black tracking-tighter text-slate-800 uppercase italic dark:text-slate-100">
                        <div className="rounded-lg bg-slate-900 p-2 text-white dark:bg-slate-100 dark:text-slate-900">
                            <Clock className="h-6 w-6" />
                        </div>
                        Lịch sử điểm thưởng
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                    {isLoadingHistory ? (
                        <div className="py-10 text-center text-sm font-bold text-slate-400 italic">
                            Đang bóc tách dữ liệu...
                        </div> //
                    ) : historyPage?.content &&
                      historyPage.content.length > 0 ? (
                        <div className="space-y-4">
                            {historyPage.content.map((item) => {
                                const isEarn = item.pointDelta > 0; //
                                return (
                                    <div
                                        key={item.id} //
                                        className="flex items-center justify-between rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5 transition-all duration-300 hover:bg-white hover:shadow-lg dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-slate-800"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`rounded-xl p-3 ${isEarn ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"}`}
                                            >
                                                {isEarn ? (
                                                    <TrendingUp size={20} />
                                                ) : (
                                                    <TrendingDown size={20} />
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm leading-none font-black text-slate-800 uppercase dark:text-slate-200">
                                                    {item.description}
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-400 italic">
                                                    {fDateTime(
                                                        item.createdAt,
                                                        "HH:mm dd/MM/yyyy"
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p
                                                className={`text-xl font-black tracking-tighter ${isEarn ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
                                            >
                                                {isEarn ? "+" : ""}
                                                {item.pointDelta.toLocaleString(
                                                    "vi-VN"
                                                )}
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                                                Số dư:{" "}
                                                {item.balanceAfter.toLocaleString(
                                                    "vi-VN"
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="flex items-center justify-between pt-6">
                                <Button
                                    variant="outline"
                                    disabled={page === 0} //
                                    onClick={() =>
                                        setPage((p) => Math.max(0, p - 1))
                                    }
                                    className="rounded-xl border-slate-200 font-bold dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                                >
                                    Trang trước
                                </Button>
                                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                    Trang {page + 1} / {historyPage.totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    disabled={
                                        page >= historyPage.totalPages - 1
                                    } //
                                    onClick={() => setPage((p) => p + 1)}
                                    className="rounded-xl border-slate-200 font-bold dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                                >
                                    Trang sau
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-[2rem] border-2 border-dashed border-slate-100 bg-slate-50/50 py-16 text-center text-sm font-bold text-slate-400 italic dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-500">
                            Chưa có dấu vết giao dịch nào.
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ƯU ĐÃI THÀNH VIÊN */}
            <Card className="overflow-hidden rounded-[2rem] border-none bg-white shadow-xl shadow-slate-200/50 dark:bg-slate-900 dark:shadow-slate-950/50">
                <CardContent className="space-y-8 p-8">
                    <h3 className="border-b pb-4 text-2xl font-black tracking-tighter text-slate-800 uppercase italic dark:border-slate-800 dark:text-slate-100">
                        Đặc quyền của bạn
                    </h3>

                    <Tabs defaultValue="member" className="w-full">
                        <TabsList className="hide-scrollbar h-auto w-full flex-nowrap justify-start gap-8 overflow-x-auto rounded-none border-none bg-transparent p-0">
                            {USER_MEMBERSHIPS_TABS.map((tab) => (
                                <TabsTrigger
                                    value={tab.value} //
                                    key={tab.value}
                                    className="cursor-pointer rounded-none border-0 border-b-4 border-transparent bg-transparent px-0 py-4 text-[10px] font-black tracking-widest text-slate-300 uppercase transition-all data-[state=active]:border-slate-900 data-[state=active]:text-slate-900 dark:text-slate-600 dark:data-[state=active]:border-slate-100 dark:data-[state=active]:text-slate-100"
                                >
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {USER_MEMBERSHIPS_TABS.map((tab) => (
                            <TabsContent
                                value={tab.value} //
                                key={tab.value}
                                className="animate-in fade-in space-y-4 pt-8 duration-500"
                            >
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {tab.content.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50"
                                        >
                                            <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-900 dark:bg-slate-100"></div>
                                            <p className="text-sm leading-relaxed font-bold text-slate-600 dark:text-slate-400">
                                                {item}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <a
                                    href="#"
                                    className="inline-flex items-center pt-4 text-[10px] font-black tracking-widest text-blue-600 uppercase hover:underline"
                                >
                                    Xem chi tiết Điều khoản & Điều kiện
                                </a>
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
