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
import { FormHelperText } from "@/components/common/help-text";

type UpdateUserFormData = z.infer<typeof updateUserSchema>;

export default function Profile() {
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
    console.log("1. Toàn bộ biến user:", user);
    console.log("2. Bên trong user.data:", user?.data);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UpdateUserFormData>({
        resolver: zodResolver(updateUserSchema),
        values: user
            ? {
                  phone: user.phone || "",
                  name: user.name || "",
              }
            : undefined,
        resetOptions: {
            keepDirty: true,
        },
    });

    const mutation = useMutation({
        mutationFn: (updatedData: UpdateUserFormData) => {
            console.log("Updating user with data:", updatedData);
            return updateProfile(updatedData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            toast.success("Cập nhật hồ sơ thành công!");
        },
        onError: (error) => {
            console.error("Error updating user:", error);
            toast.error("Cập nhật thất bại");
        },
    });

    const onSubmit = (data: UpdateUserFormData) => {
        mutation.mutate(data);
    };

    if (isLoading || !user)
        return <div className="p-10 text-center">Đang tải thông tin...</div>;
    if (isError)
        return (
            <div className="p-10 text-center text-red-500">
                Lỗi: {error.message}
            </div>
        );

    return (
        <div className="flex min-h-screen justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-7xl border-none shadow-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-green-800">
                        Thông tin cá nhân
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="fullname"
                                    className="text-gray-600"
                                >
                                    Họ & tên
                                </Label>
                                <Input
                                    id="fullname"
                                    className="focus-visible:ring-green-600"
                                    {...register("name")}
                                    disabled={mutation.isPending}
                                />
                                <FormHelperText error={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="phone"
                                    className="text-gray-600"
                                >
                                    Số điện thoại
                                </Label>
                                <Input
                                    id="phone"
                                    className="focus-visible:ring-green-600"
                                    {...register("phone")}
                                    disabled={mutation.isPending}
                                />
                                <FormHelperText error={errors.phone} />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="gender"
                                    className="text-gray-600"
                                >
                                    Giới tính
                                </Label>
                                <Input
                                    id="gender"
                                    className="focus-visible:ring-green-600"
                                    placeholder="Chưa cập nhật"
                                    disabled
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dob" className="text-gray-600">
                                    Ngày sinh
                                </Label>
                                <Input
                                    id="dob"
                                    type="date"
                                    className="focus-visible:ring-green-600"
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="max-w-md space-y-2">
                            <Label htmlFor="email" className="text-gray-600">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                className="bg-gray-100 focus-visible:ring-green-600"
                                value={user.email || ""}
                                readOnly
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                            className="h-auto cursor-pointer bg-green-700 px-10 py-2 text-base font-semibold text-white hover:bg-green-800"
                        >
                            {mutation.isPending
                                ? "Đang cập nhật..."
                                : "Cập nhật thông tin"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
