"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import {
    AlertTriangle,
    CheckCircle2,
    Eye,
    EyeOff,
    Loader2,
    Lock,
} from "lucide-react";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { resetPassword } from "@/service/auth-service";
import { resetPasswordSchema } from "@/schema/auth-shema";

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const email = searchParams.get("email");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const mutation = useMutation({
        mutationFn: (values: ResetPasswordForm) => {
            if (!email) throw new Error("Không tìm thấy thông tin email.");
            return resetPassword(email, values.password);
        },
        onSuccess: () => {
            setIsSuccess(true);
            toast.success("Đổi mật khẩu thành công!");
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        },
        onError: (error: any) => {
            toast.error(error?.message || "Đổi mật khẩu thất bại.");
        },
    });

    const onSubmit = (data: ResetPasswordForm) => {
        mutation.mutate(data);
    };

    if (!email) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 px-4">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                        <AlertTriangle className="h-7 w-7 text-red-500" />
                    </div>

                    <h1 className="mb-2 text-xl font-semibold text-gray-900">
                        Phiên xác thực không hợp lệ
                    </h1>

                    <p className="mb-6 text-sm text-gray-600">
                        Thông tin xác thực đã hết hạn hoặc không tồn tại. Vui
                        lòng thực hiện lại quy trình đặt lại mật khẩu.
                    </p>

                    <Button
                        className="w-full cursor-pointer rounded-xl"
                        onClick={() => router.replace("/forgot-password")}
                    >
                        Quay về trang Quên mật khẩu
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md border-none shadow-xl">
                {!isSuccess ? (
                    <>
                        <CardHeader className="space-y-1 text-center">
                            <div className="mb-4 flex justify-center">
                                <div className="rounded-full bg-blue-100 p-3">
                                    <Lock className="h-8 w-8 text-blue-600" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-bold">
                                Đặt lại mật khẩu
                            </CardTitle>
                            <CardDescription>
                                Tạo mật khẩu mới cho tài khoản{" "}
                                <span className="font-medium text-gray-900">
                                    {email}
                                </span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-4"
                                >
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Mật khẩu mới
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type={
                                                                showPassword
                                                                    ? "text"
                                                                    : "password"
                                                            }
                                                            placeholder="••••••••"
                                                            className="h-11 pr-10"
                                                            disabled={
                                                                mutation.isPending
                                                            }
                                                            {...field}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setShowPassword(
                                                                    !showPassword
                                                                )
                                                            }
                                                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                                                        >
                                                            {showPassword ? (
                                                                <EyeOff className="h-5 w-5" />
                                                            ) : (
                                                                <Eye className="h-5 w-5" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Xác nhận mật khẩu
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type={
                                                                showConfirmPassword
                                                                    ? "text"
                                                                    : "password"
                                                            }
                                                            placeholder="••••••••"
                                                            className="h-11 pr-10"
                                                            disabled={
                                                                mutation.isPending
                                                            }
                                                            {...field}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setShowConfirmPassword(
                                                                    !showConfirmPassword
                                                                )
                                                            }
                                                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                                                        >
                                                            {showConfirmPassword ? (
                                                                <EyeOff className="h-5 w-5" />
                                                            ) : (
                                                                <Eye className="h-5 w-5" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        className="mt-2 h-11 w-full bg-blue-600 font-semibold hover:bg-blue-700"
                                        disabled={mutation.isPending}
                                    >
                                        {mutation.isPending ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Đang cập nhật...
                                            </>
                                        ) : (
                                            "Lưu mật khẩu mới"
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </>
                ) : (
                    /* --- TRẠNG THÁI THÀNH CÔNG --- */
                    <div className="animate-in zoom-in py-10 text-center duration-300">
                        <div className="mb-6 flex justify-center">
                            <div className="rounded-full bg-green-100 p-4">
                                <CheckCircle2 className="h-12 w-12 text-green-600" />
                            </div>
                        </div>
                        <CardTitle className="mb-2 text-2xl font-bold text-green-700">
                            Thành công!
                        </CardTitle>
                        <CardDescription className="px-6 text-base">
                            Mật khẩu của bạn đã được cập nhật. Bạn sẽ được
                            chuyển hướng đến trang đăng nhập trong giây lát...
                        </CardDescription>
                        <Button
                            variant="outline"
                            className="mt-8 border-blue-600 text-blue-600 hover:bg-blue-50"
                            onClick={() => router.push("/login")}
                        >
                            Đăng nhập ngay
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
}
