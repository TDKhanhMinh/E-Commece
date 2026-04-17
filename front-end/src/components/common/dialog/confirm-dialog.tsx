"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ReactNode } from "react";

import { useTranslations } from "next-intl";

interface ConfirmDialogProps {
    trigger: ReactNode;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    loading?: boolean;
    destructive?: boolean;
}

export function ConfirmDialog({
    trigger,
    title,
    description,
    confirmText,
    cancelText,
    onConfirm,
    loading = false,
    destructive = false,
}: ConfirmDialogProps) {
    const t = useTranslations("common.confirmAction");
    const finalConfirmText = confirmText || t("confirm");
    const finalCancelText = cancelText || t("cancel");

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    {description && (
                        <AlertDialogDescription>
                            {description}
                        </AlertDialogDescription>
                    )}
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>
                        {finalCancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={loading}
                        className={
                            destructive
                                ? "bg-destructive hover:bg-destructive/90 text-white"
                                : ""
                        }
                    >
                        {loading ? t("processing") : finalConfirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
