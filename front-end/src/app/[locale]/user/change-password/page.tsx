"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { changePassword } from "@/service/auth-service";
import { changePasswordSchema } from "@/schema/auth-shema";
import * as z from "zod";
import { FormHelperText } from "@/components/common/help-text";

type ChangePasswordData = z.infer<typeof changePasswordSchema>;
export default function ChangePassword() {
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ChangePasswordData>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const mutation = useMutation({
        mutationFn: (data: ChangePasswordData) => {
            return changePassword(data);
        },
        onSuccess: () => {
            toast.success("Đổi mật khẩu thành công!");
            reset();
        },
        onError: (error) => {
            console.error("Error updating user:", error);
            toast.error(
                error.message || "Đổi mật khẩu thất bại. Vui lòng thử lại."
            );
        },
    });

    const onSubmit = (data: ChangePasswordData) => {
        mutation.mutate(data);
    };

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
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
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
                                    {...register("currentPassword")}
                                    disabled={mutation.isPending}
                                />
                                <FormHelperText
                                    error={errors.currentPassword}
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
                                    {...register("newPassword")}
                                    disabled={mutation.isPending}
                                />
                                <FormHelperText error={errors.newPassword} />
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
                                    {...register("confirmPassword")}
                                    disabled={mutation.isPending}
                                />
                                <FormHelperText
                                    error={errors.confirmPassword}
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
