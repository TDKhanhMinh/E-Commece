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
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { registerApi } from "@/service/auth-service";
import { registerSchema } from "@/schema/auth-shema";
import { FormHelperText } from "@/components/common";
import { BackButton } from "@/components/common/ui/back-button";

export default function RegisterPage() {
    const router = useRouter();
    const t = useTranslations("common.auth.register");

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
            role: "USER",
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
                toast.success(t("successToast"));
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
            <BackButton />

            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-100">
                <Card className="mt-4 border-none shadow-lg">
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
                                    {t("orRegisterWithEmail")}
                                </span>
                            </div>
                        </div>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="grid gap-4"
                        >
                            <div className="grid gap-2">
                                <Label htmlFor="full-name">
                                    {t("nameLabel")}
                                </Label>
                                <Input
                                    id="full-name"
                                    placeholder={t("namePlaceholder")}
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
                                <Label htmlFor="email">{t("emailLabel")}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder={t("emailPlaceholder")}
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
                                <Label htmlFor="phone">
                                    {t("phoneLabel")}
                                </Label>
                                <Input
                                    id="phone"
                                    type="text"
                                    placeholder={t("phonePlaceholder")}
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
                                <Label htmlFor="password">
                                    {t("passwordLabel")}
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder={t("passwordPlaceholder")}
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
                                    {t("confirmPasswordLabel")}
                                </Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    placeholder={t("passwordPlaceholder")}
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
                                    ? t("creatingAccount")
                                    : t("submit")}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-wrap items-center justify-center gap-1">
                        <span className="text-muted-foreground text-sm">
                            {t("haveAccount")}
                        </span>
                        <Link
                            href="/login"
                            className="text-primary text-sm font-semibold hover:underline"
                        >
                            {t("loginNow")}
                        </Link>
                    </CardFooter>
                </Card>

                <p className="text-muted-foreground px-8 text-center text-sm">
                    {t("agreementPrefix")}{" "}
                    <Link
                        href="/terms"
                        className="hover:text-primary underline underline-offset-4"
                    >
                        {t("privacyPolicy")}
                    </Link>{" "}
                    {t("agreementSuffix")}
                </p>
            </div>
        </div>
    );
}
