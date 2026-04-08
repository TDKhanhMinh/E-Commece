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

interface RegisterDialogProps {
    children?: React.ReactNode;
}

export default function RegisterDialog({ children }: RegisterDialogProps) {
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
            toast.success("Tạo tài khoản thành công!");
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setOpen(false);
            reset();
        },
        onError: (error: any) => {
            console.error("Register failed:", error);
            toast.error(error.message || "Có lỗi xảy ra!");
        },
    });

    const onSubmit = (data: RegisterFormData) => {
        mutation.mutate(data);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || <Button>Thêm người dùng mới</Button>}
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-x-hidden overflow-y-auto sm:max-w-125">
                <DialogHeader className="space-y-1 text-center">
                    <DialogTitle className="text-2xl font-bold tracking-tight">
                        Tạo tài khoản mới
                    </DialogTitle>
                    <DialogDescription>
                        Thêm tài khoản cho Khách hàng hoặc Shipper nội bộ
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
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
                                Hoặc đăng ký bằng Email
                            </span>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="grid gap-4"
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="full-name">Họ và tên</Label>
                            <Input
                                id="full-name"
                                placeholder="Nguyễn Văn A"
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
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
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
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                type="text"
                                placeholder="0123456789"
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

                        {/* Ô CHỌN ROLE MỚI THÊM VÀO */}
                        <div className="grid w-full gap-2">
                            <Label htmlFor="role">Vai trò</Label>
                            <Select
                                onValueChange={(value) =>
                                    setValue("role", value)
                                }
                                defaultValue={watch("role")}
                                disabled={mutation.isPending}
                            >
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Chọn vai trò" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USER">
                                        Khách hàng (USER)
                                    </SelectItem>
                                    <SelectItem value="SHIPPER">
                                        Nhân viên Giao hàng (SHIPPER)
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Mật khẩu</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
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
                                Xác nhận mật khẩu
                            </Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                placeholder="••••••••"
                                {...register("confirmPassword")}
                                className={`h-11 ${
                                    errors.confirmPassword
                                        ? "border-red-500 text-red-900 placeholder:text-red-300"
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
                                ? "Đang tạo tài khoản..."
                                : "Tạo tài khoản"}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
