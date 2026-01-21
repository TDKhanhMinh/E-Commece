"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Chrome, Github, ArrowLeft, UserPlus } from "lucide-react";

export default function RegisterPage() {
    return (
        <div className="relative container flex min-h-screen flex-col items-center justify-center lg:max-w-none lg:px-0">
            <Link
                href="/"
                className="text-muted-foreground hover:text-primary absolute top-4 left-4 flex items-center text-sm font-medium transition-colors md:top-8 md:left-8"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại trang chủ
            </Link>

            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-100">
                <Card className="mt-4 border-none shadow-lg">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold tracking-tight">
                            Tạo tài khoản mới
                        </CardTitle>
                        <CardDescription>
                            Bắt đầu trải nghiệm mua sắm tại T7M Online ngay hôm
                            nay;
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="w-full">
                                <Chrome className="mr-2 h-4 w-4" />
                                Google
                            </Button>
                            <Button variant="outline" className="w-full">
                                <Github className="mr-2 h-4 w-4" />
                                Github
                            </Button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background text-muted-foreground px-2">
                                    Hoặc đăng ký bằng Email
                                </span>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="full-name">Họ và tên</Label>
                                <Input
                                    id="full-name"
                                    placeholder="Nguyễn Văn A"
                                    className="h-11"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="h-11"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Mật khẩu</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="h-11"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirm-password">
                                    Xác nhận mật khẩu
                                </Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="h-11"
                                />
                            </div>
                        </div>

                        <Button className="mt-2 h-11 w-full font-semibold">
                            Tạo tài khoản
                        </Button>
                    </CardContent>
                    <CardFooter className="flex flex-wrap items-center justify-center gap-1">
                        <span className="text-muted-foreground text-sm">
                            Đã có tài khoản?
                        </span>
                        <Link
                            href="/login"
                            className="text-primary text-sm font-semibold hover:underline"
                        >
                            Đăng nhập
                        </Link>
                    </CardFooter>
                </Card>

                <p className="text-muted-foreground px-8 text-center text-sm">
                    Việc tạo tài khoản đồng nghĩa với việc bạn chấp nhận{" "}
                    <Link
                        href="/terms"
                        className="hover:text-primary underline underline-offset-4"
                    >
                        Chính sách bảo mật
                    </Link>{" "}
                    của chúng tôi;
                </p>
            </div>
        </div>
    );
}
