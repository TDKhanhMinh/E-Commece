"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { addDeliveryAddressSchema } from "@/schema/user-schema";
import {
    addDeliveryAddress,
    updateDeliveryAddress,
} from "@/service/user-service";
import { AddDeliveryAddress } from "@/type/user-type";
import { FormHelperText } from "../ui/help-text";
import MapAutoComplete from "../ui/map-auto-complete";

type AddAddressFormData = z.infer<typeof addDeliveryAddressSchema>;

interface AddressFormProps {
    phoneNumber?: string;
    userName?: string;
    location?: string;
    latitude?: string;
    longitude?: string;
    isDefault?: boolean;
    type?: "add" | "edit";
    addressId: number;
    onSuccess: () => void;
    onCancel: () => void;
}

export function AddressForm({
    phoneNumber,
    userName,
    location,
    latitude,
    longitude,
    isDefault,
    type,
    addressId,
    onSuccess,
    onCancel,
}: AddressFormProps) {
    const t = useTranslations("common.user.address");
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<AddAddressFormData>({
        resolver: zodResolver(addDeliveryAddressSchema),
        defaultValues: {
            location: location || "",
            userName: userName || "",
            phoneNumber: phoneNumber || "",
            isDefault: isDefault ? true : false,
            latitude: latitude || "",
            longitude: longitude || "",
        },
    });

    const mutationAdd = useMutation({
        mutationFn: (data: AddAddressFormData) => {
            const payload: AddDeliveryAddress = {
                ...data,
                latitude: data.latitude ?? "",
                longitude: data.longitude ?? "",
            };
            if (type === "add") {
                return addDeliveryAddress(payload);
            }
            return updateDeliveryAddress(addressId, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
            toast.success(type === "add" ? t("addSuccess") : t("editSuccess"));
            onSuccess();
            reset();
        },
        onError: (error) => {
            console.error("Error updating user:", error);
            toast.error(type === "add" ? t("addError") : t("editError"));
        },
    });

    const mutationEdit = useMutation({
        mutationFn: (data: AddAddressFormData) => {
            const payload: AddDeliveryAddress = {
                ...data,
                latitude: data.latitude ?? "",
                longitude: data.longitude ?? "",
            };
            return updateDeliveryAddress(addressId, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
            toast.success(t("editSuccess"));
            onSuccess();
            reset();
        },
        onError: (error) => {
            console.error("Error updating user:", error);
            toast.error(t("addError"));
        },
    });

    const onSubmit = (data: AddAddressFormData) => {
        if (type === "edit") {
            mutationEdit.mutate(data);
        } else {
            mutationAdd.mutate(data);
        }
    };

    const selectedLocation = watch("location");
    const isPending = mutationAdd.isPending || mutationEdit.isPending;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-4 sm:px-0 py-5 sm:py-0">
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label
                        htmlFor="userName"
                        className="text-sm font-semibold text-slate-700 dark:text-slate-400"
                    >
                        {t("nameLabel")}
                    </Label>
                    <Input
                        id="userName"
                        placeholder={t("namePlaceholder")}
                        className="h-11 border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-xl focus-visible:ring-blue-600"
                        {...register("userName")}
                        disabled={isPending}
                    />
                    <FormHelperText error={errors.userName} />
                </div>

                <div className="space-y-2">
                    <Label
                        htmlFor="phone"
                        className="text-sm font-semibold text-slate-700 dark:text-slate-400"
                    >
                        {t("phonePlaceholder")}
                    </Label>
                    <Input
                        id="phone"
                        placeholder={t("phonePlaceholder")}
                        className="h-11 border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-xl focus-visible:ring-blue-600"
                        {...register("phoneNumber")}
                        disabled={isPending}
                    />
                    <FormHelperText error={errors.phoneNumber} />
                </div>
            </div>

            <div className="space-y-2">
                <Label
                    htmlFor="address"
                    className="text-sm font-semibold text-slate-700 dark:text-slate-400"
                >
                    {t("detailLabel")}
                </Label>
                <MapAutoComplete
                    onSelect={(address) => {
                        setValue("location", address.description, {
                            shouldValidate: true,
                            shouldDirty: true,
                            shouldTouch: true,
                        });
                        setValue("latitude", String(address.latitude), {
                            shouldValidate: true,
                            shouldDirty: true,
                        });
                        setValue("longitude", String(address.longitude), {
                            shouldValidate: true,
                            shouldDirty: true,
                        });
                    }}
                />
                <input type="hidden" {...register("location")} />
                <input type="hidden" {...register("latitude")} />
                <input type="hidden" {...register("longitude")} />
                {selectedLocation ? (
                    <p className="text-slate-500 text-xs sm:text-sm italic dark:text-slate-500 mt-1">
                        {t("selected")}: {selectedLocation}
                    </p>
                ) : null}
                <FormHelperText error={errors.location} />
            </div>

            <div className="flex flex-row items-center justify-start gap-2 pt-1">
                <Checkbox
                    id="isDefault"
                    checked={watch("isDefault")}
                    onCheckedChange={(checked) =>
                        setValue("isDefault", checked === true)
                    }
                    disabled={isPending}
                />
                <Label
                    htmlFor="isDefault"
                    className="text-sm font-semibold text-slate-700 dark:text-slate-400 cursor-pointer"
                >
                    {t("setDefault")}
                </Label>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-3">
                <Button
                    type="button"
                    variant={"outline"}
                    className="h-11 sm:h-10 order-2 sm:order-1 cursor-pointer rounded-xl px-8 font-bold border-slate-200 dark:border-slate-800 transition-all hover:bg-slate-50 dark:hover:bg-slate-900"
                    onClick={onCancel}
                >
                    {t("cancel")}
                </Button>

                <Button
                    type="submit"
                    disabled={isPending}
                    className="h-11 sm:h-10 order-1 sm:order-2 cursor-pointer rounded-xl bg-blue-600 px-10 font-bold text-white shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition-all"
                >
                    {isPending ? t("saving") : t("save")}
                </Button>
            </div>
        </form>
    );
}
