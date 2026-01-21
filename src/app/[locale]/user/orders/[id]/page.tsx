"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, MapPin, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function OrderDetail() {
    const orderInfo = {
        id: "68da9d1fc874436fd35a8463",
        customerName: "Trần Đỗ Khánh Minh",
        phone: "0345738266",
        address:
            "UBND xã Thanh Vĩnh Đông, Tỉnh Lộ 827A, Xã Thanh Vĩnh Đông, Huyện Châu Thành, Tỉnh Long An",
        status: "Đã hủy",
        paymentMethod: "COD(Cash on Delivery)",
        shippingMethod: "Mặc định",
        orderDate: "2025-09-29: 21:52",
        deliveryDate: "2026-01-21: 14:48",
    };

    const priceInfo = {
        subtotal: "22.000.000 đ",
        memberDiscount: "0 đ",
        productDiscount: "2.000.000 đ",
        shippingFee: "30.000 đ",
        voucherDiscount: "0 đ",
        total: "20.030.000 đ",
    };

    const products = [
        {
            name: "Laptop Lenovo IdeaPad Slim 3 15IRH10 - 83K1000JVN (i7-13620H...",
            sku: "i7-13620H/ Onboard graphics/ 16GB/ 512GB/ Windows 11",
            price: "20.000.000 đ",
            originalPrice: "22.000.000 đ",
            quantity: 1,
            image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=200&h=200&fit=crop",
        },
    ];

    return (
        <div className="mx-auto min-h-screen max-w-7xl p-4 md:p-6">
            <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="border-none shadow-sm lg:col-span-2">
                    <CardHeader className="pb-4">
                        <div className="mb-4 flex items-center gap-2">
                            <Link
                                href="/user/orders"
                                className="text-secondary-dark 00 hover:text-info cursor-pointer transition-colors"
                            >
                                <ChevronLeft className="size-5" />
                            </Link>
                            <CardTitle className="text-xl font-bold">
                                Chi tiết đơn hàng
                            </CardTitle>
                        </div>

                        <div className="space-y-1">
                            <p className="text-secondary-dark text-lg font-bold">
                                Mã đơn hàng: {orderInfo.id}
                            </p>
                            <div className="text-secondary-dark mt-2 flex items-start gap-2 text-sm">
                                <MapPin className="mt-0.5 size-4 shrink-0 text-blue-600" />
                                <div>
                                    <span className="font-semibold">
                                        {orderInfo.customerName} -{" "}
                                        {orderInfo.phone}
                                    </span>
                                    <p className="text-secondary-dark mt-1 leading-relaxed">
                                        Địa chỉ: {orderInfo.address}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="space-y-4 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-secondary-dark font-semibold">
                                    Trạng thái đơn hàng
                                </span>
                                <span className="font-medium text-red-500">
                                    {orderInfo.status}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-secondary-dark font-semibold">
                                    Phương thức thanh toán
                                </span>
                                <span className="text-secondary-dark">
                                    {orderInfo.paymentMethod}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-secondary-dark font-semibold">
                                    Phương thức vận chuyển
                                </span>
                                <span className="text-secondary-dark">
                                    {orderInfo.shippingMethod}
                                </span>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2 text-sm">
                            <div className="text-secondary-dark flex justify-between">
                                <span>Tổng tiền sản phẩm</span>
                                <span className="text-secondary-dark">
                                    {priceInfo.subtotal}
                                </span>
                            </div>
                            <div className="text-secondary-dark flex justify-between">
                                <span>Ưu đãi thành viên (đã giảm)</span>
                                <span className="text-secondary-dark">
                                    {priceInfo.memberDiscount}
                                </span>
                            </div>
                            <div className="text-secondary-dark flex justify-between">
                                <span>Ưu đãi sản phẩm (đã giảm)</span>
                                <span className="text-secondary-dark">
                                    {priceInfo.productDiscount}
                                </span>
                            </div>
                            <div className="text-secondary-dark flex justify-between">
                                <span>Phí vận chuyển</span>
                                <span className="text-secondary-dark">
                                    {priceInfo.shippingFee}
                                </span>
                            </div>
                            <div className="text-secondary-dark flex justify-between">
                                <span>Giảm giá</span>
                                <span className="text-secondary-dark">
                                    {priceInfo.voucherDiscount}
                                </span>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <span className="text-secondary-dark text-base font-bold">
                                Tổng tiền thanh toán
                            </span>
                            <span className="text-secondary-dark text-xl font-bold">
                                {priceInfo.total}
                            </span>
                        </div>

                        <div className="text-secondary-dark space-y-1 pt-2 text-right text-xs">
                            <p>Thời gian đặt hàng: {orderInfo.orderDate}</p>
                            <p>Ngày giao hàng: {orderInfo.deliveryDate}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="h-fit border-none shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg font-bold">
                            <ShoppingBag className="size-5" />
                            Danh sách sản phẩm
                        </CardTitle>
                        <p className="text-secondary-dark text-sm">
                            {products.length} món
                        </p>
                    </CardHeader>

                    <CardContent className="min-h-screen">
                        {products.map((product, index) => (
                            <div
                                key={index}
                                className="flex gap-4 rounded-xl border bg-white p-4"
                            >
                                <div className="relative h-20 w-20 shrink-0">
                                    <Image
                                        src={product.image}
                                        alt="Product"
                                        fill
                                        className="rounded-md object-contain"
                                    />
                                </div>

                                <div className="flex-1 space-y-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="text-secondary-dark line-clamp-2 text-sm font-medium">
                                            {product.name}
                                        </h4>

                                        <span className="shrink-0 rounded-md bg-green-700 px-2 py-1 text-xs font-bold text-white">
                                            x{product.quantity}
                                        </span>
                                    </div>

                                    <p className="text-secondary-dark line-clamp-1 text-xs">
                                        SKU: {product.sku}
                                    </p>

                                    <div className="flex items-center gap-2 pt-1">
                                        <span className="text-sm font-bold text-red-500">
                                            {product.price}
                                        </span>
                                        <span className="text-secondary-dark text-xs line-through decoration-gray-400">
                                            {product.originalPrice}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
