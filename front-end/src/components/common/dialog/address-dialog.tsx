"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Separator } from "../../ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { AddressForm } from "../user/address-form";

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
    isDefault?: boolean;
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
    isDefault,
}: AddressDialogProps) {
    const [open, setOpen] = useState(false);
    const isMobile = useIsMobile();

    const trigger = (
        <Button
            variant={"ghost"}
            className="flex cursor-pointer items-center gap-1.5 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95 h-9 px-3 rounded-lg"
        >
            {btnText}
        </Button>
    );

    const formProps = {
        phoneNumber,
        userName,
        location,
        latitude,
        longitude,
        isDefault,
        type,
        addressId,
        onSuccess: () => setOpen(false),
        onCancel: () => setOpen(false),
    };

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>{trigger}</DrawerTrigger>
                <DrawerContent className="max-h-[90dvh] dark:bg-slate-950">
                    <DrawerHeader className="text-left px-6">
                        <DrawerTitle className="text-xl font-bold tracking-tight dark:text-slate-100">
                            {title}
                        </DrawerTitle>
                    </DrawerHeader>
                    <Separator className="opacity-50" />
                    <div className="overflow-y-auto px-2 pb-8">
                        <AddressForm {...formProps} />
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-w-2xl overflow-hidden border-none p-0 shadow-2xl dark:bg-slate-950 sm:rounded-2xl">
                <DialogHeader className="p-4 sm:p-6 pb-2 sm:pb-2">
                    <DialogTitle className="text-lg sm:text-xl px-2 text-left font-bold tracking-tight dark:text-slate-100">
                        {title}
                    </DialogTitle>
                </DialogHeader>
                <Separator className="opacity-50" />
                <div className="px-4 sm:px-8 py-5 sm:py-6">
                    <AddressForm {...formProps} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
