"use client";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";

export default function AddressDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="flex cursor-pointer items-center gap-1 text-sm font-bold hover:underline">
                    Thêm địa chỉ mới
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl overflow-hidden border-none p-0 shadow-2xl">
                <DialogHeader className="mt-4 p-2">
                    <DialogTitle className="text-md px-2 text-left font-semibold tracking-wide uppercase">
                        Thêm địa chỉ mới
                    </DialogTitle>
                </DialogHeader>
                <Separator />
                <form className="space-y-6 px-8 py-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label
                                htmlFor="fullname"
                                className="font-medium text-gray-600"
                            >
                                Họ & tên
                            </Label>
                            <Input
                                id="fullname"
                                placeholder="Nhập họ và tên"
                                className="h-11 border-gray-300"
                            />
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
                            />
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
                        />
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                        <DialogClose asChild>
                            <Button
                                variant={"outline"}
                                className="text-md h-auto cursor-pointer rounded-md px-12 font-semibold shadow-lg"
                            >
                                Hủy
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            className="text-md h-auto cursor-pointer rounded-md bg-blue-600 px-12 font-semibold text-white shadow-lg hover:bg-blue-800"
                        >
                            Lưu địa chỉ
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
