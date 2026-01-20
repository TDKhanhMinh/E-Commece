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
import { Chrome, Github, ArrowLeft } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="relative container flex min-h-screen flex-col items-center justify-center lg:max-w-none lg:px-0">
            <Link
                href="/"
                className="text-muted-foreground hover:text-primary absolute top-4 left-4 flex items-center text-sm font-medium transition-colors md:top-8 md:left-8"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại trang chủ
            </Link>

            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-87.5 lg:w-96">
                <Card className="border-none shadow-lg">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold tracking-tight">
                            Đăng nhập
                        </CardTitle>
                        <CardDescription>
                            Nhập email của bạn để truy cập tài khoản T7M Online;
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
                                    Hoặc tiếp tục với
                                </span>
                            </div>
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
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Mật khẩu</Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-primary text-sm font-medium hover:underline"
                                >
                                    Quên mật khẩu?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                className="h-11"
                            />
                        </div>
                        <Button className="mt-2 h-11 w-full font-semibold">
                            Đăng nhập
                        </Button>
                    </CardContent>
                    <CardFooter className="flex flex-wrap items-center justify-center gap-1">
                        <span className="text-muted-foreground text-sm">
                            Chưa có tài khoản?
                        </span>
                        <Link
                            href="/register"
                            className="text-primary text-sm font-semibold hover:underline"
                        >
                            Đăng ký ngay
                        </Link>
                    </CardFooter>
                </Card>

                <p className="text-muted-foreground px-8 text-center text-sm">
                    Bằng cách tiếp tục, bạn đồng ý với{" "}
                    <Link
                        href="/terms"
                        className="hover:text-primary underline underline-offset-4"
                    >
                        Điều khoản dịch vụ
                    </Link>{" "}
                    của chúng tôi;
                </p>
            </div>
        </div>
    );
}
