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
import { FormHelperText } from "@/components/common/ui/help-text";

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
        <div className="flex min-h-screen items-start justify-center bg-gray-50/30 p-3 sm:p-4 sm:pt-10">
            <Card className="w-full max-w-2xl border-none shadow-sm dark:bg-slate-900/50">
                <CardHeader className="border-b space-y-1.5 p-4 sm:p-6">
                    <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl font-bold">
                        <Lock className="size-5 sm:size-6 text-blue-600 dark:text-blue-500" />
                        Thay đổi mật khẩu
                    </CardTitle>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu
                        cho người khác
                    </p>
                </CardHeader>

                <CardContent className="p-4 sm:p-8">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5 sm:space-y-6"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="current-password" title="Mật khẩu hiện tại" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Mật khẩu hiện tại
                            </Label>
                            <div className="relative">
                                <Input
                                    id="current-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="********"
                                    className="h-11 pr-10 focus-visible:ring-blue-600 dark:bg-slate-950"
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
                                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                            >
                                Mật khẩu mới
                            </Label>
                            <div className="relative">
                                <Input
                                    id="new-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="********"
                                    className="h-11 pr-10 focus-visible:ring-blue-600 dark:bg-slate-950"
                                    {...register("newPassword")}
                                    disabled={mutation.isPending}
                                />
                                <FormHelperText error={errors.newPassword} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm-password" title="Xác nhận mật khẩu mới" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Xác nhận mật khẩu mới
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirm-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="********"
                                    className="h-11 pr-10 focus-visible:ring-blue-600 dark:bg-slate-950"
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
                                    className="hover: absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 p-1 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="rounded-xl bg-blue-50/50 p-4 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                            <h4 className="mb-2 text-xs sm:text-sm font-bold text-blue-900 dark:text-blue-300">
                                Quy định mật khẩu:
                            </h4>
                            <ul className="list-disc space-y-1.5 pl-4 text-[11px] sm:text-xs text-slate-600 dark:text-slate-400">
                                <li>Tối thiểu 8 ký tự.</li>
                                <li>
                                    Nên bao gồm cả chữ cái và chữ số để tăng độ
                                    bảo mật.
                                </li>
                            </ul>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-end mt-2">
                            <Button
                                type="submit"
                                className="h-12 w-full sm:w-auto cursor-pointer rounded-xl bg-blue-600 px-10 text-base font-bold text-white shadow-lg shadow-blue-200 dark:shadow-none transition-all hover:bg-blue-700 hover:translate-y-[-1px] active:translate-y-[0px]"
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
