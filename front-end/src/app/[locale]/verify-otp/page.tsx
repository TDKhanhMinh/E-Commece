"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

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
    FormMessage,
} from "@/components/ui/form";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { otpSchema } from "@/schema/auth-shema";
import { forgotPassword, verifyOtp } from "@/service/auth-service";
import { BackButton } from "@/components/common/ui/back-button";

type OtpFormValues = z.infer<typeof otpSchema>;

export default function VerifyOtpPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "your-email@example.com";

    const [countdown, setCountdown] = useState(60);
    const canResend = countdown === 0;

    const form = useForm<OtpFormValues>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: "",
        },
    });

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const verifyMutation = useMutation({
        mutationFn: (otp: string) => verifyOtp(email, otp),
        onSuccess: () => {
            toast.success("Xác thực thành công!");
            router.push("/reset-password?email=" + email);
        },
        onError: (error: any) => {
            toast.error(
                error?.message || "Mã OTP không chính xác hoặc đã hết hạn."
            );
        },
    });

    const resendMutation = useMutation({
        mutationFn: () => forgotPassword(email),
        onSuccess: () => {
            toast.success("Đã gửi lại mã OTP mới!");
            setCountdown(60);
        },
        onError: () => {
            toast.error("Gửi lại thất bại. Vui lòng thử lại sau.");
        },
    });

    const onSubmit = (data: OtpFormValues) => {
        verifyMutation.mutate(data.otp);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md border-none shadow-xl">
                <CardHeader className="space-y-1 text-center p-5 sm:p-6 pb-2 sm:pb-4">
                    <div className="mb-2 sm:mb-4 flex justify-center">
                        <div className="rounded-full bg-blue-100 p-2 sm:p-3">
                            <ShieldCheck className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                        </div>
                    </div>
                    <CardTitle className="text-xl sm:text-2xl font-bold">
                        Nhập mã xác thực
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                        Chúng tôi đã gửi mã 6 số đến email:
                        <br />
                        <span className="font-medium text-gray-900 break-all">
                            {email}
                        </span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col items-center space-y-6"
                        >
                            <FormField
                                control={form.control}
                                name="otp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <InputOTP
                                                maxLength={6}
                                                {...field}
                                                disabled={
                                                    verifyMutation.isPending
                                                }
                                            >
                                                <InputOTPGroup className="gap-1 sm:gap-2">
                                                    <InputOTPSlot
                                                        index={0}
                                                        className="h-10 w-10 sm:h-12 sm:w-12 text-base sm:text-lg"
                                                    />
                                                    <InputOTPSlot
                                                        index={1}
                                                        className="h-10 w-10 sm:h-12 sm:w-12 text-base sm:text-lg"
                                                    />
                                                    <InputOTPSlot
                                                        index={2}
                                                        className="h-10 w-10 sm:h-12 sm:w-12 text-base sm:text-lg"
                                                    />
                                                </InputOTPGroup>
                                                <InputOTPSeparator />
                                                <InputOTPGroup className="gap-1 sm:gap-2">
                                                    <InputOTPSlot
                                                        index={3}
                                                        className="h-10 w-10 sm:h-12 sm:w-12 text-base sm:text-lg"
                                                    />
                                                    <InputOTPSlot
                                                        index={4}
                                                        className="h-10 w-10 sm:h-12 sm:w-12 text-base sm:text-lg"
                                                    />
                                                    <InputOTPSlot
                                                        index={5}
                                                        className="h-10 w-10 sm:h-12 sm:w-12 text-base sm:text-lg"
                                                    />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="h-11 w-full cursor-pointer bg-blue-600 font-semibold hover:bg-blue-700"
                                disabled={verifyMutation.isPending}
                            >
                                {verifyMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang xác thực...
                                    </>
                                ) : (
                                    "Xác nhận"
                                )}
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-6 text-center text-sm">
                        <p className="mb-2 text-gray-500">
                            Bạn không nhận được mã?
                        </p>
                        {canResend ? (
                            <button
                                type="button"
                                onClick={() => resendMutation.mutate()}
                                className="cursor-pointer border-none bg-transparent font-semibold text-blue-600 hover:underline"
                                disabled={resendMutation.isPending}
                            >
                                {resendMutation.isPending
                                    ? "Đang gửi..."
                                    : "Gửi lại mã"}
                            </button>
                        ) : (
                            <p className="text-gray-400">
                                Gửi lại sau{" "}
                                <span className="font-mono font-medium text-gray-600">
                                    {countdown}s
                                </span>
                            </p>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center rounded-b-xl border-t bg-gray-50/50 p-4">
                    <BackButton />
                </CardFooter>
            </Card>
        </div>
    );
}
