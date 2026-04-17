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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Attribute } from "@/type/attribute-type";
import { useCreateAttribute, useUpdateAttribute } from "@/hooks/use-attributes";

const formSchema = z.object({
    name: z.string().min(1, "Tên thuộc tính không được để trống"),
    code: z
        .string()
        .min(1, "Mã code không được để trống")
        .regex(/^[a-zA-Z0-9_]+$/, "Mã chỉ chứa chữ, số và gạch dưới"),
    type: z.enum(["TEXT", "SELECT", "NUMBER"] as const, {
        error: "Vui lòng chọn loại thuộc tính",
    }),
});
interface AttributeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    attributeToEdit?: Attribute | null;
}

export function AttributeDialog({
    open,
    onOpenChange,
    attributeToEdit,
}: AttributeDialogProps) {
    const t = useTranslations("attributes.dialog");
    const tCommon = useTranslations("common");

    const formSchema = z.object({
        name: z.string().min(1, t("validation.nameRequired")),
        code: z
            .string()
            .min(1, t("validation.codeRequired"))
            .regex(/^[a-zA-Z0-9_]+$/, t("validation.codePattern")),
        type: z.enum(["TEXT", "SELECT", "NUMBER"] as const, {
            error: t("validation.typeRequired"),
        }),
    });

    const createMutation = useCreateAttribute();
    const updateMutation = useUpdateAttribute();
    const isEditing = !!attributeToEdit;
    const isLoading = createMutation.isPending || updateMutation.isPending;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "", code: "", type: "TEXT" },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                name: attributeToEdit?.name || "",
                code: attributeToEdit?.code || "",
                type: attributeToEdit?.type || "TEXT",
            });
        }
    }, [open, attributeToEdit, form]);

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (isEditing && attributeToEdit) {
            updateMutation.mutate(
                { id: attributeToEdit.id, data: values },
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
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t("codeLabel")}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={t("codePlaceholder")}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("typeLabel")}</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t("typePlaceholder")} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="TEXT">
                                                {t("types.text")}
                                            </SelectItem>
                                            <SelectItem value="SELECT">
                                                {t("types.select")}
                                            </SelectItem>
                                            <SelectItem value="NUMBER">
                                                {t("types.number")}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
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
