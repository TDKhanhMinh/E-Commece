"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
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
import { toast } from "sonner";
import { forgotPasswordSchema } from "@/schema/auth-shema";
import { forgotPassword } from "@/service/auth-service";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/common/ui/back-button";

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const router = useRouter();
    const form = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const mutation = useMutation({
        mutationFn: (values: ForgotPasswordForm) => {
            return forgotPassword(values.email);
        },
        onSuccess: () => {
            router.push("/verify-otp?email=" + form.getValues("email"));
            toast.success("Đã gửi OTP khôi phục thành công!");
        },
        onError: (error) => {
            console.error(error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại.");
        },
    });

    const onSubmit = (data: ForgotPasswordForm) => {
        mutation.mutate(data);
    };

    // @ts-ignore
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-slate-950">
            <Card className="w-full max-w-md border-none shadow-xl dark:bg-slate-900 dark:border dark:border-slate-800">
                <>
                    <CardHeader className="space-y-1 text-center">
                        <div className="mb-2 flex justify-center">
                            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                                <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold dark:text-slate-100">
                            Quên mật khẩu?
                        </CardTitle>
                        <CardDescription className="dark:text-slate-400">
                            Đừng lo lắng! Nhập email của bạn và chúng tôi sẽ gửi
                            OTP dẫn đặt lại mật khẩu.
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
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="dark:text-slate-300">
                                                Email đăng ký
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="name@example.com"
                                                    {...field}
                                                    disabled={
                                                        mutation.isPending
                                                    }
                                                    className="h-11 focus-visible:ring-blue-600 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100 dark:focus-visible:ring-blue-500"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="text-md h-11 w-full bg-blue-600 font-semibold hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                                    disabled={mutation.isPending}
                                >
                                    {mutation.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Đang gửi...
                                        </>
                                    ) : (
                                        "Gửi OTP đặt lại mật khẩu"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </>

                <CardFooter className="flex justify-center rounded-b-xl border-t bg-gray-50/50 p-4 dark:bg-slate-900/50 dark:border-slate-800">
                    <BackButton />
                </CardFooter>
            </Card>
        </div>
    );
}
