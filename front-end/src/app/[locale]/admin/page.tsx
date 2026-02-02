"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ShieldCheck, ShoppingCart, Users } from "lucide-react";
import Link from "next/link";

export default function AdminWelcomePage() {
    return (
        <div className="space-y-8 p-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Chào mừng Admin
                </h1>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Người dùng
                        </CardTitle>
                        <Users className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,245</div>
                        <p className="text-muted-foreground text-xs">
                            +12 trong tuần này
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Đơn hàng
                        </CardTitle>
                        <ShoppingCart className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">356</div>
                        <p className="text-muted-foreground text-xs">
                            +5 hôm nay
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Sản phẩm
                        </CardTitle>
                        <Package className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">87</div>
                        <p className="text-muted-foreground text-xs">
                            Đang hoạt động
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Bảo mật
                        </CardTitle>
                        <ShieldCheck className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            OK
                        </div>
                        <p className="text-muted-foreground text-xs">
                            Không có cảnh báo
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Thao tác nhanh</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                    <Button asChild>
                        <Link href="/admin/users">Quản lý người dùng</Link>
                    </Button>

                    <Button variant="outline" asChild>
                        <Link href="/admin/orders">Quản lý đơn hàng</Link>
                    </Button>

                    <Button variant="outline" asChild>
                        <Link href="/admin/products">Quản lý sản phẩm</Link>
                    </Button>

                    <Button variant="secondary" asChild>
                        <Link href="/admin/settings">Cài đặt hệ thống</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
