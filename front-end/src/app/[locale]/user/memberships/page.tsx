"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { USER_MEMBERSHIPS_TABS } from "../../../../../mock"; // Giữ nguyên đường dẫn của bạn
import { usePoints } from "@/hooks/use-point";
import { useAuthStore } from "@/store/useAuthStore";
import { Clock, TrendingDown, TrendingUp } from "lucide-react";
import { fDateTime } from "@/lib/format-date-time";

// Ánh xạ tên hạng thành viên sang tiếng Việt
const TIER_MAP: Record<string, string> = {
    MEMBER: "Thành viên",
    SILVER: "Bạc",
    GOLD: "Vàng",
    PLATINUM: "Bạch Kim",
};

// Ánh xạ hạng tiếp theo
const NEXT_TIER_MAP: Record<string, string> = {
    MEMBER: "Bạc",
    SILVER: "Vàng",
    GOLD: "Bạch Kim",
    PLATINUM: "Tối đa",
};

export default function Membership() {
    const { user } = useAuthStore();
    const userId = user?.id ? parseInt(user.id) : 0;

    // Lấy state phân trang cho lịch sử
    const [page, setPage] = useState(0);
    const size = 5; // Hiển thị 5 giao dịch mỗi trang

    const { useMyPointSummary, useMyPointHistory } = usePoints();

    // Fetch dữ liệu
    const { data: summary, isLoading: isLoadingSummary } = useMyPointSummary();
    const { data: historyPage, isLoading: isLoadingHistory } =
        useMyPointHistory(userId, page, size);

    // Tính toán cho thanh Progress Bar
    const calculateProgress = () => {
        if (!summary) return 0;
        if (summary.membershipTier === "PLATINUM") return 100;

        const currentAcc = summary.totalAccumulatedPoints || 0;
        const missing = summary.pointsToNextTier || 0;
        const target = currentAcc + missing;

        if (target === 0) return 0;
        return (currentAcc / target) * 100;
    };

    if (isLoadingSummary) {
        return (
            <div className="p-6 text-center text-gray-500">
                Đang tải thông tin thành viên...
            </div>
        );
    }

    const currentTierName = TIER_MAP[summary?.membershipTier || "MEMBER"];
    const nextTierName = NEXT_TIER_MAP[summary?.membershipTier || "MEMBER"];
    const isMaxTier = summary?.membershipTier === "PLATINUM";

    return (
        <div className="min-h-screen space-y-6 p-6">
            {/* CARD HEADER - TỔNG QUAN */}
            <div className="relative h-32 overflow-visible rounded-xl bg-linear-to-r from-green-800 to-green-600">
                <Card className="absolute -bottom-[65%] left-1/2 w-[90%] max-w-2xl -translate-x-1/2 border-none shadow-xl">
                    <CardContent className="space-y-2 py-4 text-center">
                        <h2 className="text-2xl font-bold italic">
                            Hạng thành viên:{" "}
                            <span className="text-green-600">
                                {currentTierName}
                            </span>
                        </h2>

                        <p className="font-medium text-gray-600">
                            Điểm tích lũy hiện tại:{" "}
                            <span className="text-green-600">
                                {summary?.totalAccumulatedPoints?.toLocaleString(
                                    "vi-VN"
                                ) || 0}{" "}
                                điểm
                            </span>
                        </p>

                        {!isMaxTier ? (
                            <p className="text-sm text-gray-500">
                                Tích thêm{" "}
                                <span className="font-bold text-green-600">
                                    {summary?.pointsToNextTier?.toLocaleString(
                                        "vi-VN"
                                    ) || 0}{" "}
                                    điểm
                                </span>{" "}
                                nữa để lên hạng{" "}
                                <span className="font-bold text-green-600">
                                    {nextTierName}
                                </span>
                            </p>
                        ) : (
                            <p className="text-sm font-bold text-green-600">
                                Bạn đã đạt hạng thành viên cao nhất!
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="h-12"></div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* ĐIỂM CÓ THỂ TIÊU (CURRENT POINTS) */}
                <Card className="border-none shadow-sm">
                    <CardContent className="space-y-4 p-6">
                        <h3 className="text-lg font-bold">Điểm đổi quà</h3>
                        <p className="text-sm">
                            Bạn có{" "}
                            <span className="text-xl font-bold text-green-600">
                                {summary?.currentPoints?.toLocaleString(
                                    "vi-VN"
                                ) || 0}
                            </span>{" "}
                            điểm
                        </p>
                        <Button className="w-full rounded-xl bg-blue-600 py-6 text-lg transition-colors hover:bg-blue-700">
                            Mua hàng ngay
                        </Button>
                    </CardContent>
                </Card>

                {/* TIẾN TRÌNH LÊN HẠNG */}
                <Card className="border-none shadow-sm">
                    <CardContent className="space-y-4 p-6">
                        <h3 className="text-lg font-bold">
                            Tiến trình lên hạng
                        </h3>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Hạng hiện tại:{" "}
                                <span className="font-medium text-green-600">
                                    {currentTierName}
                                </span>
                            </p>
                            {!isMaxTier && (
                                <p className="text-sm text-gray-600">
                                    Cần thêm{" "}
                                    <span className="font-bold">
                                        {summary?.pointsToNextTier?.toLocaleString(
                                            "vi-VN"
                                        ) || 0}
                                    </span>{" "}
                                    điểm để lên{" "}
                                    <span className="font-bold text-gray-500">
                                        {nextTierName}
                                    </span>
                                </p>
                            )}
                        </div>
                        {/* Cập nhật thanh Progress động dựa vào data */}
                        <Progress
                            value={calculateProgress()}
                            className="h-3 bg-gray-200"
                        />
                    </CardContent>
                </Card>
            </div>

            {/* LỊCH SỬ ĐIỂM (PHẦN MỚI THÊM) */}
            <Card className="border-none shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg font-bold">
                        <Clock className="h-5 w-5 text-green-600" />
                        Lịch sử biến động điểm
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoadingHistory ? (
                        <div className="py-4 text-center text-sm text-gray-500">
                            Đang tải lịch sử...
                        </div>
                    ) : historyPage?.content &&
                      historyPage.content.length > 0 ? (
                        <div className="space-y-4">
                            {historyPage.content.map((item) => {
                                const isEarn = item.pointDelta > 0;
                                return (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 p-3 transition-colors hover:bg-gray-50"
                                    >
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-800">
                                                {item.description}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {fDateTime(
                                                    item.createdAt,
                                                    "HH:mm dd/MM/yyyy"
                                                )}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p
                                                className={`flex items-center justify-end gap-1 text-base font-bold ${isEarn ? "text-green-600" : "text-red-500"}`}
                                            >
                                                {isEarn ? (
                                                    <TrendingUp className="h-4 w-4" />
                                                ) : (
                                                    <TrendingDown className="h-4 w-4" />
                                                )}
                                                {isEarn ? "+" : ""}
                                                {item.pointDelta.toLocaleString(
                                                    "vi-VN"
                                                )}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Số dư:{" "}
                                                {item.balanceAfter.toLocaleString(
                                                    "vi-VN"
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Nút phân trang cơ bản */}
                            <div className="flex items-center justify-between pt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page === 0}
                                    onClick={() =>
                                        setPage((p) => Math.max(0, p - 1))
                                    }
                                >
                                    Trang trước
                                </Button>
                                <span className="text-xs text-gray-500">
                                    Trang {page + 1} / {historyPage.totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={
                                        page >= historyPage.totalPages - 1
                                    }
                                    onClick={() => setPage((p) => p + 1)}
                                >
                                    Trang sau
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 py-8 text-center text-sm text-gray-500">
                            Chưa có lịch sử giao dịch điểm nào.
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ƯU ĐÃI THÀNH VIÊN (GIỮ NGUYÊN) */}
            <Card className="border-none shadow-sm">
                <CardContent className="space-y-6 p-6">
                    <h3 className="text-lg font-bold text-green-800">
                        Ưu đãi thành viên
                    </h3>

                    <Tabs defaultValue="member" className="w-full">
                        <TabsList className="hide-scrollbar h-auto w-full flex-nowrap justify-start gap-6 overflow-x-auto rounded-none border-b bg-transparent p-0">
                            {USER_MEMBERSHIPS_TABS.map((tab) => (
                                <TabsTrigger
                                    value={tab.value}
                                    key={tab.value}
                                    className="cursor-pointer rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 py-2 font-bold text-gray-400 data-[state=active]:border-green-600 data-[state=active]:text-green-600"
                                >
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {USER_MEMBERSHIPS_TABS.map((tab) => (
                            <TabsContent
                                value={tab.value}
                                key={tab.value}
                                className="space-y-3 pt-6 text-sm text-gray-700"
                            >
                                {tab.content.map((item, index) => (
                                    <p
                                        key={index}
                                        className="flex items-start gap-2"
                                    >
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500"></span>
                                        {item}
                                    </p>
                                ))}
                                <a
                                    href="#"
                                    className="inline-block pt-2 text-xs text-green-600 hover:underline"
                                >
                                    Điều khoản & Điều kiện
                                </a>
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
