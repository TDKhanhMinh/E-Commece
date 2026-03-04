"use client";

import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search } from "lucide-react";
import { UserOrderItem } from "@/components/common";
import { useCancelOrder, useOrdersByUser } from "@/hooks/use-order";
import { useMemo, useState } from "react";
import { OrderPageResponse, OrderStatus } from "@/type/order-type";
import { Button } from "@/components/ui/button";

export default function OrderHistory() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;

    const params = useMemo(() => {
        const searchParams: any = {
            page: currentPage,
            size: pageSize,
            sort: "createdAt,desc",
        };

        if (activeTab !== "all") {
            searchParams.status = activeTab as OrderStatus;
        }

        return searchParams;
    }, [activeTab, currentPage]);

    const { data: orderPageData, isLoading, error } = useOrdersByUser(params);

    const orderPage = orderPageData as unknown as OrderPageResponse;
    const ordersList = orderPage?.content || [];
    console.log("Fetched orders:", ordersList);

    const tabs = [
        { value: "all", label: "TẤT CẢ" },
        { value: "PENDING", label: "CHỜ THANH TOÁN" },
        { value: "CONFIRMED", label: "ĐÃ XÁC NHẬN" },
        { value: "PAID", label: "ĐÃ THANH TOÁN" },
        { value: "SHIPPING", label: "ĐANG GIAO HÀNG" },
        { value: "DELIVERED", label: "ĐÃ GIAO" },
        { value: "CANCELLED", label: "ĐÃ HỦY" },
        { value: "FAILED", label: "THẤT BẠI" },
    ];

    const filteredOrders = useMemo(() => {
        if (!searchQuery.trim()) return ordersList;

        const query = searchQuery.toLowerCase();
        return ordersList.filter((order) =>
            order.orderId.toString().includes(query)
        );
    }, [ordersList, searchQuery]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        setCurrentPage(0);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();

    const handleCancelOrder = (orderId: string) => {
        cancelOrder(Number(orderId));
    };
    // Loading state
    if (isLoading) {
        return (
            <div className="w-full rounded-xl border bg-white p-6 shadow-sm">
                <div className="flex min-h-100 items-center justify-center">
                    <Loader2 className="text-primary h-8 w-8 animate-spin" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full rounded-xl border bg-white p-6 shadow-sm">
                <div className="flex min-h-100 items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-600">
                            Không thể tải danh sách đơn hàng
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                            Vui lòng thử lại sau
                        </p>
                    </div>
                </div>
            </div>
        );
    }

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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="min-h-screen w-full"
            >
                <TabsList className="scrollbar-hide mb-0 h-auto w-full flex-nowrap justify-start gap-6 overflow-x-auto rounded-none border-b bg-transparent p-0">
                    {tabs.map((tab) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="shrink-0 cursor-pointer rounded-none border-t-0 border-r-0 border-b-2 border-l-0 bg-transparent px-0 py-3 text-sm font-medium text-gray-500 uppercase data-[state=active]:border-green-600 data-[state=active]:text-green-600"
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
                                {filteredOrders.length > 0 ? (
                                    <>
                                        {filteredOrders.map((order) => (
                                            <div
                                                key={order.orderId}
                                                className="relative"
                                            >
                                                <UserOrderItem
                                                    id={order.orderId.toString()}
                                                    title={`Đơn hàng #${order.orderId} - ${order.items.length} sản phẩm`}
                                                    price={`${order.finalAmount.toLocaleString("vi-VN")} đ`}
                                                    image={
                                                        order.items[0]?.image ||
                                                        "/placeholder.png"
                                                    }
                                                    status={order.status}
                                                    isCancelling={isCancelling}
                                                    handleCancelOrder={
                                                        handleCancelOrder
                                                    }
                                                />
                                            </div>
                                        ))}

                                        {orderPage &&
                                            orderPage.totalPages > 1 && (
                                                <div className="mt-4 flex items-center justify-between border-t pt-6">
                                                    <div className="text-sm text-gray-500">
                                                        Hiển thị{" "}
                                                        {
                                                            orderPage.numberOfElements
                                                        }{" "}
                                                        trong tổng số{" "}
                                                        {
                                                            orderPage.totalElements
                                                        }{" "}
                                                        đơn hàng
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handlePageChange(
                                                                    currentPage -
                                                                        1
                                                                )
                                                            }
                                                            disabled={
                                                                orderPage.first
                                                            }
                                                        >
                                                            Trước
                                                        </Button>
                                                        <div className="flex items-center gap-2">
                                                            {Array.from(
                                                                {
                                                                    length: orderPage.totalPages,
                                                                },
                                                                (_, i) => (
                                                                    <Button
                                                                        key={i}
                                                                        variant={
                                                                            currentPage ===
                                                                            i
                                                                                ? "default"
                                                                                : "outline"
                                                                        }
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            handlePageChange(
                                                                                i
                                                                            )
                                                                        }
                                                                        className="min-w-10"
                                                                    >
                                                                        {i + 1}
                                                                    </Button>
                                                                )
                                                            )}
                                                        </div>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handlePageChange(
                                                                    currentPage +
                                                                        1
                                                                )
                                                            }
                                                            disabled={
                                                                orderPage.last
                                                            }
                                                        >
                                                            Sau
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                    </>
                                ) : (
                                    <div className="py-20 text-center">
                                        <p className="text-gray-400">
                                            {searchQuery
                                                ? "Không tìm thấy đơn hàng nào"
                                                : "Chưa có đơn hàng nào"}
                                        </p>
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
