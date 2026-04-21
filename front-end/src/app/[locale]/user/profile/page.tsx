"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile } from "@/service/user-service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema } from "@/schema/user-schema";
import * as z from "zod";
import { toast } from "sonner";
import { FormHelperText } from "@/components/common/ui/help-text";

type UpdateUserFormData = z.infer<typeof updateUserSchema>;

import { useTranslations } from "next-intl";

export default function Profile() {
    const t = useTranslations("user.profile");
    const queryClient = useQueryClient();

    const {
        data: user,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["profile"],
        queryFn: getProfile,
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UpdateUserFormData>({
        resolver: zodResolver(updateUserSchema),
        values: user
            ? {
                  //@ts-ignore
                  phone: user.phone || "",
                  //@ts-ignore
                  name: user.name || "",
              }
            : undefined,
        resetOptions: {
            keepDirty: true,
        },
    });

    const mutation = useMutation({
        mutationFn: (updatedData: UpdateUserFormData) => {
            return updateProfile(updatedData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            toast.success(t("successToast"));
        },
        onError: (error) => {
            console.error("Error updating user:", error);
            toast.error(t("errorToast"));
        },
    });

    const onSubmit = (data: UpdateUserFormData) => {
        mutation.mutate(data);
    };

    if (isLoading || !user)
        return (
            <div className="p-10 text-center">{t("loading")}</div>
        );
    if (isError)
        return (
            <div className="p-10 text-center text-red-500">
                {t("error", { message: error.message })}
            </div>
        );

    return (
        <div className="flex min-h-screen justify-center border-none bg-gray-50 p-2 sm:p-4 dark:bg-slate-950">
            <Card className="w-full max-w-7xl border-none shadow-md dark:bg-slate-900 dark:shadow-slate-950/50">
                <CardHeader className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <CardTitle className="text-xl sm:text-2xl font-bold text-green-800 dark:text-green-400">
                        {t("title")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4 sm:space-y-6"
                    >
                        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="fullname"
                                    className="text-gray-600 dark:text-slate-400"
                                >
                                    {t("nameLabel")}
                                </Label>
                                <Input
                                    id="fullname"
                                    className="focus-visible:ring-green-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                                    {...register("name")}
                                    disabled={mutation.isPending}
                                />
                                <FormHelperText error={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="phone"
                                    className="text-gray-600 dark:text-slate-400"
                                >
                                    {t("phoneLabel")}
                                </Label>
                                <Input
                                    id="phone"
                                    className="focus-visible:ring-green-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                                    {...register("phone")}
                                    disabled={mutation.isPending}
                                />
                                <FormHelperText error={errors.phone} />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="gender"
                                    className="text-gray-600 dark:text-slate-400"
                                >
                                    {t("genderLabel")}
                                </Label>
                                <Input
                                    id="gender"
                                    className="focus-visible:ring-green-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                                    placeholder={t("genderPlaceholder")}
                                    disabled
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="dob"
                                    className="text-gray-600 dark:text-slate-400"
                                >
                                    {t("dobLabel")}
                                </Label>
                                <Input
                                    id="dob"
                                    type="date"
                                    className="focus-visible:ring-green-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="max-w-md space-y-2">
                            <Label
                                htmlFor="email"
                                className="text-gray-600 dark:text-slate-400"
                            >
                                {t("emailLabel")}
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                className="bg-gray-100 focus-visible:ring-green-600 dark:bg-slate-800 dark:text-slate-400"
                                //@ts-ignore
                                value={user.email || ""}
                                readOnly
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                            className="h-10 sm:h-auto cursor-pointer bg-green-700 w-full sm:w-auto px-10 py-2 text-sm sm:text-base font-semibold text-white hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700"
                        >
                            {mutation.isPending
                                ? t("updatingButton")
                                : t("submitButton")}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
