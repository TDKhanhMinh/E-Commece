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

type AddAddressFormData = z.infer<typeof addDeliveryAddressSchema>;
interface AddressDialogProps {
    phoneNumber?: string;
    userName?: string;
    location?: string;
    btnText: string;
    title: string;
    type?: "add" | "edit";
    addressId: number;
}
export function AddressDialog({
    phoneNumber,
    userName,
    location,
    btnText,
    title,
    type,
    addressId,
}: AddressDialogProps) {
    const [open, setOpen] = useState(false);

    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AddAddressFormData>({
        resolver: zodResolver(addDeliveryAddressSchema),
        defaultValues: {
            location: location || "",
            userName: userName || "",
            phoneNumber: phoneNumber || "",
            isDefault: false,
        },
    });

    const mutationAdd = useMutation({
        mutationFn: (data: AddAddressFormData) => {
            if (type === "add") {
                return addDeliveryAddress(data);
            }
            return updateDeliveryAddress(addressId, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
            toast.success("Thêm địa chỉ thành công!");
            setOpen(false);
            reset();
        },
        onError: (error) => {
            console.error("Error updating user:", error);
            toast.error("Thêm địa chỉ thất bại");
        },
    });
    const mutationEdit = useMutation({
        mutationFn: (data: AddAddressFormData) => {
            return updateDeliveryAddress(addressId, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
            toast.success("Chỉnh sửa địa chỉ thành công!");
            setOpen(false);
            reset();
        },
        onError: (error) => {
            console.error("Error updating user:", error);
            toast.error("Thêm địa chỉ thất bại");
        },
    });

    const onSubmit = (data: AddAddressFormData) => {
        if (type === "edit") {
            mutationEdit.mutate(data);
        } else {
            mutationAdd.mutate(data);
        }
    };

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

            <DialogContent className="max-w-2xl overflow-hidden border-none p-0 shadow-2xl">
                <DialogHeader className="mt-4 p-2">
                    <DialogTitle className="text-md px-2 text-left font-semibold tracking-wide uppercase">
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
                                className="font-medium text-gray-600"
                            >
                                Họ & tên
                            </Label>
                            <Input
                                id="userName"
                                placeholder="Nhập họ và tên"
                                className="h-11 border-gray-300"
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
                                className="font-medium text-gray-600"
                            >
                                Số điện thoại
                            </Label>
                            <Input
                                id="phone"
                                placeholder="Nhập số điện thoại"
                                className="h-11 border-gray-300"
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
                            className="font-medium text-gray-600"
                        >
                            Địa chỉ chi tiết (Số nhà, tên đường, ...)
                        </Label>
                        <Input
                            id="address"
                            placeholder="Nhập địa chỉ chi tiết"
                            className="border-gray-300"
                            {...register("location")}
                            disabled={
                                mutationAdd.isPending || mutationEdit.isPending
                            }
                        />
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
                            className="mx-2 font-medium text-gray-600"
                        >
                            Đặt làm địa chỉ mặc định
                        </Label>
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                        <Button
                            type="button"
                            variant={"outline"}
                            className="text-md h-auto cursor-pointer rounded-md px-12 font-semibold shadow-lg"
                            onClick={() => setOpen(false)}
                        >
                            Hủy
                        </Button>

                        <Button
                            type="submit"
                            disabled={
                                mutationAdd.isPending || mutationEdit.isPending
                            }
                            className="text-md h-auto cursor-pointer rounded-md bg-blue-600 px-12 font-semibold text-white shadow-lg hover:bg-blue-800"
                        >
                            {mutationAdd.isPending
                                ? "Đang lưu..."
                                : "Lưu địa chỉ"}
                            {mutationEdit.isPending ? "Đang lưu..." : ""}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
