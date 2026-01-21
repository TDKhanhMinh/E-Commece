"use client";

import UserOrderItem from "@/components/common/user-order-item";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

const ORDERS = [
    {
        id: "68da9d1fc874436fd35a8463",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop",
        title: "Laptop Dell XPS 13 9310 - UBND xã Thanh Vĩnh Đông, Tỉnh Lộ 827A...",
        price: "20.030.000 đ",
        status: "completed",
    },
    {
        id: "68cfec5ff839d7ce4388fc62",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=200&h=200&fit=crop",
        title: "MacBook Air M1 2020 - UBND xã Thanh Vĩnh Đông, Tỉnh Lộ 827A...",
        price: "20.020.000 đ",
        status: "processing",
    },
];

export default function OrderHistory() {
    const tabs = [
        { value: "all", label: "TẤT CẢ" },
        { value: "processing", label: "ĐANG XỬ LÝ" },
        { value: "shipping", label: "ĐANG GIAO" },
        { value: "completed", label: "HOÀN THÀNH" },
        { value: "cancelled", label: "HUỶ" },
    ];

    return (
        <div className="w-full rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-2 flex flex-col items-center justify-between gap-4 md:flex-row">
                <h2 className="self-start text-xl font-bold md:self-center">
                    Lịch sử đơn hàng
                </h2>

                <div className="relative w-full md:w-80">
                    <Input
                        placeholder="Tìm kiếm theo mã đơn hàng"
                        className="h-10 rounded-full border-gray-200 bg-gray-50 pr-10 pl-4 text-sm"
                    />
                    <Search className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            <Tabs defaultValue="all" className="min-h-screen w-full">
                <TabsList className="mb-0 h-auto w-full justify-start gap-6 rounded-none border-b bg-transparent p-0">
                    {tabs.map((tab) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="cursor-pointer rounded-none border-t-0 border-r-0 border-b-2 border-l-0 bg-transparent px-0 py-3 text-sm font-medium text-gray-500 uppercase data-[state=active]:border-green-600 data-[state=active]:text-green-600"
                        >
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <div className="mt-0">
                    {tabs.map((tab) => (
                        <TabsContent
                            key={tab.value}
                            value={tab.value}
                            className="m-0"
                        >
                            <div className="flex flex-col">
                                {ORDERS.map((order) => (
                                    <UserOrderItem
                                        key={order.id}
                                        id={order.id}
                                        title={order.title}
                                        price={order.price}
                                        image={order.image}
                                    />
                                ))}

                                {tab.value !== "all" && ORDERS.length > 0 && (
                                    <div className="py-10 text-center text-sm text-gray-400">
                                        Không có đơn hàng nào
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    ))}
                </div>
            </Tabs>
        </div>
    );
}
