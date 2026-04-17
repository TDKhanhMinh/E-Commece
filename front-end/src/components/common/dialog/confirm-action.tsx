"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface ConfirmActionProps {
    title: string;
    btnText: string;
    description: string;
    requiredText: string;
    actionText: string;
    onConfirm: () => void;
    isPending?: boolean;
}

const ConfirmAction = ({
    title,
    btnText,
    description,
    requiredText,
    actionText,
    onConfirm,
    isPending = false,
}: ConfirmActionProps) => {
    const [open, setOpen] = useState(false);
    const [confirmText, setConfirmText] = useState("");

    useEffect(() => {
        if (!open) {
            setConfirmText("");
        }
    }, [open]);

    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="font-medium text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
                >
                    {btnText}
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                        <DialogTitle className="text-lg font-semibold">
                            {title}
                        </DialogTitle>
                    </div>

                    <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <Separator />

                <div className="space-y-2">
                    <Label className="text-sm font-medium">
                        Nhập{" "}
                        <span className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs dark:bg-slate-800 dark:text-slate-100">
                            {requiredText}
                        </span>{" "}
                        để xác nhận
                    </Label>

                    <Input
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder={requiredText}
                        autoFocus
                        className="font-mono tracking-wide"
                    />
                </div>

                <DialogFooter className="gap-2 space-x-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                    >
                        Hủy
                    </Button>

                    <Button
                        type="button"
                        variant="destructive"
                        disabled={confirmText !== requiredText || isPending}
                        onClick={handleConfirm}
                        className="min-w-30"
                    >
                        {isPending ? "Processing..." : actionText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmAction;
