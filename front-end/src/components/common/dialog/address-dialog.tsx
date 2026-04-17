"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "../../ui/separator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    addDeliveryAddress,
    updateDeliveryAddress,
} from "@/service/user-service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { addDeliveryAddressSchema } from "@/schema/user-schema";
import { FormHelperText } from "../ui/help-text";
import MapAutoComplete from "../ui/map-auto-complete";
import { AddDeliveryAddress } from "@/type/user-type";

import { useTranslations } from "next-intl";

type AddAddressFormData = z.infer<typeof addDeliveryAddressSchema>;
interface AddressDialogProps {
    phoneNumber?: string;
    userName?: string;
    location?: string;
    latitude?: string;
    longitude?: string;
    btnText: string;
    title: string;
    type?: "add" | "edit";
    addressId: number;
}
export function AddressDialog({
    phoneNumber,
    userName,
    location,
    latitude,
    longitude,
    btnText,
    title,
    type,
    addressId,
}: AddressDialogProps) {
    const [open, setOpen] = useState(false);
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
            isDefault: false,
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
            console.log("Add payload ", payload);
            if (type === "add") {
                return addDeliveryAddress(payload);
            }
            return updateDeliveryAddress(addressId, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
            toast.success(type === "add" ? t("addSuccess") : t("editSuccess"));
            setOpen(false);
            reset();
        },
        onError: (error) => {
            console.error("Error updating user:", error);
            toast.error(t("addError"));
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
            setOpen(false);
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant={"ghost"}
                    className="flex cursor-pointer items-center gap-1 text-sm font-bold hover:bg-transparent hover:underline"
                >
                    {btnText}
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl overflow-hidden border-none p-0 shadow-2xl dark:bg-slate-950">
                <DialogHeader className="mt-4 p-2">
                    <DialogTitle className="text-md px-2 text-left font-semibold tracking-wide uppercase dark:text-slate-100">
                        {title}
                    </DialogTitle>
                </DialogHeader>
                <Separator />
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6 px-8 py-6"
                >
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label
                                htmlFor="userName"
                                className="font-medium text-gray-600 dark:text-slate-400"
                            >
                                {t("nameLabel")}
                            </Label>
                            <Input
                                id="userName"
                                placeholder={t("namePlaceholder")}
                                className="h-11 border-gray-300 dark:border-slate-800 dark:bg-slate-900"
                                {...register("userName")}
                                disabled={
                                    mutationAdd.isPending ||
                                    mutationEdit.isPending
                                }
                            />
                            <FormHelperText error={errors.userName} />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="phone"
                                className="font-medium text-gray-600 dark:text-slate-400"
                            >
                                {t("phonePlaceholder")}
                            </Label>
                            <Input
                                id="phone"
                                placeholder={t("phonePlaceholder")}
                                className="h-11 border-gray-300 dark:border-slate-800 dark:bg-slate-900"
                                {...register("phoneNumber")}
                                disabled={
                                    mutationAdd.isPending ||
                                    mutationEdit.isPending
                                }
                            />
                            <FormHelperText error={errors.phoneNumber} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="address"
                            className="font-medium text-gray-600 dark:text-slate-400"
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
                                setValue(
                                    "longitude",
                                    String(address.longitude),
                                    {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    }
                                );
                            }}
                        />
                        <input type="hidden" {...register("location")} />
                        <input type="hidden" {...register("latitude")} />
                        <input type="hidden" {...register("longitude")} />
                        {selectedLocation ? (
                            <p className="text-muted-foreground text-sm dark:text-slate-500">
                                {t("selected")}: {selectedLocation}
                            </p>
                        ) : null}
                        <FormHelperText error={errors.location} />
                    </div>
                    <div className="flex flex-row items-center justify-start">
                        <input
                            type="checkbox"
                            id="isDefault"
                            {...register("isDefault")}
                            disabled={
                                mutationAdd.isPending || mutationEdit.isPending
                            }
                        />
                        <Label
                            htmlFor="isDefault"
                            className="mx-2 font-medium text-gray-600 dark:text-slate-400"
                        >
                            {t("setDefault")}
                        </Label>
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                        <Button
                            type="button"
                            variant={"outline"}
                            className="text-md h-auto cursor-pointer rounded-md px-12 font-semibold shadow-lg"
                            onClick={() => setOpen(false)}
                        >
                            {t("cancel")}
                        </Button>

                        <Button
                            type="submit"
                            disabled={
                                mutationAdd.isPending || mutationEdit.isPending
                            }
                            className="text-md h-auto cursor-pointer rounded-md bg-blue-600 px-12 font-semibold text-white shadow-lg hover:bg-blue-800"
                        >
                            {mutationAdd.isPending || mutationEdit.isPending
                                ? t("saving")
                                : t("save")}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
