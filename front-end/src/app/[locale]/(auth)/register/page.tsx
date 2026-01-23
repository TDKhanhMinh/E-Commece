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
import { ArrowLeft, Chrome, Github } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FormHelperText } from "@/components/common/help-text";
import { registerApi } from "@/service/auth-service";

export default function RegisterPage() {
    const router = useRouter();
    const registerSchema = z
        .object({
            phone: z
                .string()
                .min(10, "Số điện thoại phải có 10 ký tự")
                .max(10, "Số điện thoại phải có 10 ký tự"),
            email: z
                .string()
                .min(1, "Vui lòng nhập email")
                .email("Email không hợp lệ"),
            name: z.string().min(1, "Vui lòng nhập tên đầy đủ"),
            password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
            confirmPassword: z
                .string()
                .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: "Mật khẩu nhập lại không khớp",
            path: ["confirmPassword"],
        });
    type RegisterFormData = z.infer<typeof registerSchema>;
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            name: "",
            phone: "",
            confirmPassword: "",
        },
    });

    const mutation = useMutation({
        mutationFn: (data: RegisterFormData) => {
            const { confirmPassword, ...payload } = data;
            return registerApi(payload);
        },
        onSuccess: () => {
            // @ts-ignore
            router.push("/login");
            setTimeout(() => {
                toast.success("Đăng ký thành công!");
            }, 1000);
        },
        onError: (error) => {
            console.error("Register failed:", error);
            toast.error(error.message);
        },
    });
    const onSubmit = (data: RegisterFormData) => {
        mutation.mutate(data);
    };
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

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="grid gap-4"
                        >
                            <div className="grid gap-2">
                                <Label htmlFor="full-name">Họ và tên</Label>
                                <Input
                                    id="full-name"
                                    placeholder="Nguyễn Văn A"
                                    {...register("name")}
                                    className={`h-11 ${
                                        errors.name
                                            ? "border-red-500 text-red-900 placeholder:text-red-300"
                                            : ""
                                    }`}
                                    disabled={mutation.isPending}
                                />
                                <FormHelperText error={errors.name} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    {...register("email")}
                                    className={`h-11 ${
                                        errors.email
                                            ? "border-red-500 text-red-900 placeholder:text-red-300"
                                            : ""
                                    }`}
                                    disabled={mutation.isPending}
                                />
                                <FormHelperText error={errors.email} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    type="text"
                                    placeholder="0123456789"
                                    {...register("phone")}
                                    className={`h-11 ${
                                        errors.phone
                                            ? "border-red-500 text-red-900 placeholder:text-red-300"
                                            : ""
                                    }`}
                                    disabled={mutation.isPending}
                                />
                                <FormHelperText error={errors.phone} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Mật khẩu</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register("password")}
                                    className={`h-11 ${
                                        errors.password
                                            ? "border-red-500 text-red-900 placeholder:text-red-300"
                                            : ""
                                    }`}
                                    disabled={mutation.isPending}
                                />
                                <FormHelperText error={errors.password} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirm-password">
                                    Xác nhận mật khẩu
                                </Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register("confirmPassword")}
                                    className={`h-11 ${
                                        errors.confirmPassword
                                            ? "border-red-500 text-red-900 placeholder:text-red-300"
                                            : ""
                                    }`}
                                    disabled={mutation.isPending}
                                />
                                <FormHelperText
                                    error={errors.confirmPassword}
                                />
                            </div>
                            <Button
                                type={"submit"}
                                className="mt-2 h-11 w-full cursor-pointer font-semibold"
                            >
                                {mutation.isPending
                                    ? "Đang tạo tài khoản..."
                                    : "Tạo tài khoản"}
                            </Button>
                        </form>
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
