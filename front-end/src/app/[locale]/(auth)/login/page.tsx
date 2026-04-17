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
import { Chrome, Github } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/service/auth-service";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { loginSchema } from "@/schema/auth-shema";
import { FormHelperText } from "@/components/common";
import { BackButton } from "@/components/common/ui/back-button";

export default function LoginPage() {
    const { setAuth } = useAuthStore();
    const router = useRouter();
    const t = useTranslations("common.auth.login");

    type LoginFormData = z.infer<typeof loginSchema>;
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const mutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            console.log("Login successful:", data);
            // @ts-ignore
            setAuth(data.token, data.user);
            console.log(data);
            // @ts-ignore
            if (data.role.toString().toLocaleLowerCase() === "admin") {
                router.push("/admin");
            } else {
                router.push("/");
            }
            setTimeout(() => {
                toast.success(t("successToast"));
            }, 1000);
        },
        onError: (error) => {
            console.error("Login failed:", error);
            toast.error(error.message);
        },
    });
    const onSubmit = (data: LoginFormData) => {
        mutation.mutate(data);
    };
    return (
        <div className="relative container flex min-h-screen flex-col items-center justify-center lg:max-w-none lg:px-0">
            <BackButton />

            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-87.5 lg:w-96">
                <Card className="border-none shadow-lg">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold tracking-tight">
                            {t("title")}
                        </CardTitle>
                        <CardDescription>{t("description")}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="w-full">
                                <Chrome className="mr-2 h-4 w-4" />
                                {t("google")}
                            </Button>
                            <Button variant="outline" className="w-full">
                                <Github className="mr-2 h-4 w-4" />
                                {t("github")}
                            </Button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background text-muted-foreground px-2">
                                    {t("orContinueWith")}
                                </span>
                            </div>
                        </div>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <div className="grid gap-2">
                                <Label htmlFor="email">{t("emailLabel")}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className={`h-11 ${
                                        errors.email
                                            ? "border-red-500 text-red-900 placeholder:text-red-300"
                                            : ""
                                    }`}
                                    disabled={mutation.isPending}
                                    {...register("email")}
                                />
                                <FormHelperText error={errors.email} />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">
                                        {t("passwordLabel")}
                                    </Label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-primary text-sm font-medium hover:underline"
                                    >
                                        {t("forgotPassword")}
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    className={`h-11 ${
                                        errors.password
                                            ? "border-red-500 text-red-900 placeholder:text-red-300"
                                            : ""
                                    }`}
                                    {...register("password")}
                                    disabled={mutation.isPending}
                                />
                                <FormHelperText error={errors.password} />
                            </div>
                            <Button
                                type={"submit"}
                                className="mt-2 h-11 w-full cursor-pointer font-semibold"
                            >
                                {mutation.isPending
                                    ? t("loggingIn")
                                    : t("submit")}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-wrap items-center justify-center gap-1">
                        <span className="text-muted-foreground text-sm">
                            {t("noAccount")}
                        </span>
                        <Link
                            href="/register"
                            className="text-primary text-sm font-semibold hover:underline"
                        >
                            {t("registerNow")}
                        </Link>
                    </CardFooter>
                </Card>

                <p className="text-muted-foreground px-8 text-center text-sm">
                    {t("agreementPrefix")}{" "}
                    <Link
                        href="/terms"
                        className="hover:text-primary underline underline-offset-4"
                    >
                        {t("termsOfService")}
                    </Link>{" "}
                    {t("agreementSuffix")}
                </p>
            </div>
        </div>
    );
}
