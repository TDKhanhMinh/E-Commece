"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function ChangePassword() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex min-h-screen items-start justify-center bg-gray-50/30 p-4 pt-10">
            <Card className="w-full max-w-2xl border-none shadow-sm">
                <CardHeader className="border-b pb-4">
                    <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                        <Lock className="size-6" />
                        Thay đổi mật khẩu
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                        Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu
                        cho người khác
                    </p>
                </CardHeader>

                <CardContent className="pt-8">
                    <form className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="current-password text-gray-700">
                                Mật khẩu hiện tại
                            </Label>
                            <div className="relative">
                                <Input
                                    id="current-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="********"
                                    className="h-11 pr-10 focus-visible:ring-blue-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="new-password"
                                className="text-gray-700"
                            >
                                Mật khẩu mới
                            </Label>
                            <div className="relative">
                                <Input
                                    id="new-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="********"
                                    className="h-11 pr-10 focus-visible:ring-blue-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm-password text-gray-700">
                                Xác nhận mật khẩu mới
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirm-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="********"
                                    className="h-11 pr-10 focus-visible:ring-blue-600"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="hover: absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="rounded-lg bg-blue-50 p-4 dark:bg-transparent">
                            <h4 className="mb-1 text-sm font-semibold">
                                Quy định mật khẩu:
                            </h4>
                            <ul className="list-disc space-y-1 pl-4 text-xs">
                                <li>Tối thiểu 8 ký tự.</li>
                                <li>
                                    Nên bao gồm cả chữ cái và chữ số để tăng độ
                                    bảo mật.
                                </li>
                            </ul>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                className="h-auto cursor-pointer rounded-md bg-blue-700 px-12 text-base font-bold text-white shadow-md transition-all hover:bg-blue-800"
                            >
                                Cập nhật mật khẩu
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
