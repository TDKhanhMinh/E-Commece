"use client";

import { Button } from "@/components/ui/button";
import { SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart, useCartSummary } from "@/hooks/use-cart";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartItemResponse } from "@/type/cart-type";

export function CartSheet() {
    const { data: cart, isLoading } = useCart();
    console.log("Cart data:", cart);
    const summary = useCartSummary();
    console.log("Cart summary:", summary);

    if (!isLoading && (!cart || !cart.items || cart.items.length === 0)) {
        return (
            <SheetContent className="h-full w-full p-4 sm:max-w-lg">
                <SheetTitle>Giỏ hàng của bạn</SheetTitle>
                <div className="flex h-full flex-col items-center justify-center">
                    <div className="flex flex-col items-center justify-center p-4">
                        <ShoppingCart className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                        <span className="text-muted-foreground mb-2 text-sm font-medium">
                            Giỏ hàng trống
                        </span>
                        <p className="text-muted-foreground mb-6 text-center text-sm">
                            Giỏ hàng của bạn đang chờ sản phẩm đầu tiên. Hãy tìm
                            sản phẩm yêu thích chỉ với vài cú click.
                        </p>
                        <Link href="/">
                            <Button className="rounded-2xl">
                                Mua sắm ngay
                            </Button>
                        </Link>
                    </div>
                </div>
            </SheetContent>
        );
    }

    if (isLoading) {
        return (
            <SheetContent className="h-full w-full p-4 sm:max-w-lg">
                <SheetTitle>Giỏ hàng của bạn</SheetTitle>
                <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">Đang tải...</p>
                </div>
            </SheetContent>
        );
    }

    // Cart with items
    return (
        <SheetContent className="flex h-full w-full flex-col p-0 sm:max-w-lg">
            <div className="border-b p-4">
                <SheetTitle>
                    Giỏ hàng của bạn ({summary.itemCount} sản phẩm)
                </SheetTitle>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {cart?.items.map((item: CartItemResponse) => (
                        <div
                            key={item.id}
                            className="bg-card flex gap-3 rounded-lg border p-3"
                        >
                            <div className="h-20 w-20 shrink-0 rounded-md border bg-white p-1">
                                <img
                                    src={item?.image}
                                    alt={item.productName}
                                    className="h-full w-full object-contain"
                                />
                            </div>

                            <div className="flex flex-1 flex-col justify-between">
                                <div>
                                    <h4 className="line-clamp-2 text-sm font-semibold">
                                        {item.productName}
                                    </h4>
                                    <p className="text-muted-foreground mt-1 text-xs">
                                        {Object.entries(item.attributes)
                                            .map(([, value]) => value)
                                            .join(" • ")}
                                    </p>
                                </div>

                                <div className="mt-2 flex items-center justify-between">
                                    <span className="text-xs font-medium">
                                        x{item.quantity}
                                    </span>
                                    <div className="text-right">
                                        {item.discountPercent &&
                                        item.discountPercent > 0 ? (
                                            <div className="flex flex-col items-end">
                                                <span className="text-muted-foreground text-xs line-through">
                                                    {item.price.toLocaleString(
                                                        "vi-VN"
                                                    )}
                                                    đ
                                                </span>
                                                <span className="text-primary text-sm font-bold">
                                                    {(
                                                        item.salePrice ||
                                                        item.price
                                                    ).toLocaleString("vi-VN")}
                                                    đ
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-primary text-sm font-bold">
                                                {item.price.toLocaleString(
                                                    "vi-VN"
                                                )}
                                                đ
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <div className="bg-muted/30 border-t p-4">
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tạm tính</span>
                        <span className="font-medium">
                            {summary.totalAmount.toLocaleString("vi-VN")}đ
                        </span>
                    </div>
                    {summary.totalDiscount > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                Giảm giá
                            </span>
                            <span className="text-destructive font-medium">
                                -{summary.totalDiscount.toLocaleString("vi-VN")}
                                đ
                            </span>
                        </div>
                    )}
                    <Separator />
                    <div className="flex items-baseline justify-between">
                        <span className="font-semibold">Tổng cộng</span>
                        <span className="text-primary text-xl font-bold">
                            {summary.finalAmount.toLocaleString("vi-VN")}đ
                        </span>
                    </div>

                    <SheetClose asChild>
                        <Link href="/cart" className="block">
                            <Button
                                className="mt-2 h-11 w-full rounded-2xl text-base font-semibold"
                                size="lg"
                            >
                                Xem giỏ hàng
                            </Button>
                        </Link>
                    </SheetClose>
                </div>
            </div>
        </SheetContent>
    );
}
