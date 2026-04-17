"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Chrome, Github } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { registerApi } from "@/service/auth-service";
import { registerSchema } from "@/schema/auth-shema";
import { FormHelperText } from "@/components/common";
import { useTranslations } from "next-intl";

interface RegisterDialogProps {
    children?: React.ReactNode;
}

export default function RegisterDialog({ children }: RegisterDialogProps) {
    const t = useTranslations("common.registerDialog");
    const [open, setOpen] = useState(false);
    type RegisterFormData = z.infer<typeof registerSchema> & { role: string };
    const queryClient = useQueryClient();
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { confirmPassword, ...payload } = data;
            console.log("Registering user with payload:", payload);
            return registerApi(payload);
        },
        onSuccess: () => {
            toast.success(t("success"));
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setOpen(false);
            reset();
        },
        onError: (error: any) => {
            console.error("Register failed:", error);
            toast.error(error.message || t("error"));
        },
    });

    const onSubmit = (data: RegisterFormData) => {
        mutation.mutate(data);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || <Button>{t("trigger")}</Button>}
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-x-hidden overflow-y-auto sm:max-w-125">
                <DialogHeader className="space-y-1 text-center">
                    <DialogTitle className="text-2xl font-bold tracking-tight">
                        {t("title")}
                    </DialogTitle>
                    <DialogDescription>
                        {t("description")}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
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
                            <span className="bg-background text-muted-foreground px-2 dark:bg-slate-950">
                                {t("orWithEmail")}
                            </span>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="grid gap-4"
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="full-name">{t("nameLabel")}</Label>
                            <Input
                                id="full-name"
                                placeholder={t("namePlaceholder")}
                                {...register("name")}
                                className={`h-11 ${
                                    errors.name
                                        ? "border-red-500 text-red-900 placeholder:text-red-300 dark:text-red-100"
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
                                        ? "border-red-500 text-red-900 placeholder:text-red-300 dark:text-red-100"
                                        : ""
                                }`}
                                disabled={mutation.isPending}
                            />
                            <FormHelperText error={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phone">{t("phoneLabel")}</Label>
                            <Input
                                id="phone"
                                type="text"
                                placeholder={t("phonePlaceholder")}
                                {...register("phone")}
                                className={`h-11 ${
                                    errors.phone
                                        ? "border-red-500 text-red-900 placeholder:text-red-300 dark:text-red-100"
                                        : ""
                                }`}
                                disabled={mutation.isPending}
                            />
                            <FormHelperText error={errors.phone} />
                        </div>

                        {/* Ô CHỌN ROLE MỚI THÊM VÀO */}
                        <div className="grid w-full gap-2">
                            <Label htmlFor="role">{t("roleLabel")}</Label>
                            <Select
                                onValueChange={(value) =>
                                    setValue("role", value)
                                }
                                defaultValue={watch("role")}
                                disabled={mutation.isPending}
                            >
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder={t("rolePlaceholder")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USER">
                                        {t("roles.user")}
                                    </SelectItem>
                                    <SelectItem value="SHIPPER">
                                        {t("roles.shipper")}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">{t("passwordLabel")}</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder={t("passwordPlaceholder")}
                                {...register("password")}
                                className={`h-11 ${
                                    errors.password
                                        ? "border-red-500 text-red-900 placeholder:text-red-300 dark:text-red-100"
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
                                        ? "border-red-500 text-red-900 placeholder:text-red-300 dark:text-red-100"
                                        : ""
                                }`}
                                disabled={mutation.isPending}
                            />
                            <FormHelperText error={errors.confirmPassword} />
                        </div>

                        <Button
                            type="submit"
                            className="mt-2 h-11 w-full cursor-pointer font-semibold"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending
                                ? t("creating")
                                : t("submit")}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
