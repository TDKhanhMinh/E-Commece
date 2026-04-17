"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Brand } from "@/type/brand-type";
import { useCreateBrand, useUpdateBrand } from "@/hooks/use-brands";

const formSchema = z.object({
    name: z.string().min(1, "Tên thương hiệu không được để trống"),
    description: z.string().optional(),
    logo: z.string().optional(),
});

interface BrandDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    brandToEdit?: Brand | null;
}

export function BrandDialog({
    open,
    onOpenChange,
    brandToEdit,
}: BrandDialogProps) {
    const t = useTranslations("brands.dialog");
    const tCommon = useTranslations("common");

    const formSchema = z.object({
        name: z.string().min(1, t("validation.nameRequired")),
        description: z.string().optional(),
        logo: z.string().optional(),
    });

    const createMutation = useCreateBrand();
    const updateMutation = useUpdateBrand();
    const isEditing = !!brandToEdit;
    const isLoading = createMutation.isPending || updateMutation.isPending;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "", description: "", logo: "" },
    });

    // Reset form khi mở dialog
    useEffect(() => {
        if (open) {
            form.reset({
                name: brandToEdit?.name || "",
                description: brandToEdit?.description || "",
                logo: brandToEdit?.logo || "",
            });
        }
    }, [open, brandToEdit, form]);

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (isEditing && brandToEdit) {
            updateMutation.mutate(
                { id: brandToEdit.id, data: values },
                { onSuccess: () => onOpenChange(false) }
            );
        } else {
            createMutation.mutate(values, {
                onSuccess: () => onOpenChange(false),
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? t("editTitle")
                            : t("addTitle")}
                    </DialogTitle>
                    <DialogDescription>
                        {t("description")}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("nameLabel")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={t("namePlaceholder")}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="logo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("logoLabel")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={t("logoPlaceholder")}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("descLabel")}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={t("descPlaceholder")}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => onOpenChange(false)}
                            >
                                {tCommon("cancel")}
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {isEditing ? t("saveChanges") : t("create")}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
