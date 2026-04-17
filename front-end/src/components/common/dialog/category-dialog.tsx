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
import { useCreateCategory, useUpdateCategory } from "@/hooks/use-categories";
import { categorySchema } from "@/schema/category-schema";
import { Category } from "@/type/category-type";

interface CategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categoryToEdit?: Category | null;
    categoriesTree: Category[] | [];
}
type formCategoryData = z.infer<typeof categorySchema>;
export function CategoryDialog({
    open,
    onOpenChange,
    categoryToEdit,
    categoriesTree,
}: CategoryDialogProps) {
    const t = useTranslations("categories.dialog");
    const tCommon = useTranslations("common");
    const createMutation = useCreateCategory();
    const updateMutation = useUpdateCategory();

    const isEditing = !!categoryToEdit;
    const isLoading = createMutation.isPending || updateMutation.isPending;

    const form = useForm<formCategoryData>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            parentId: "root",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                name: categoryToEdit?.name || "",
                // @ts-ignore
                parentId: categoryToEdit?.parentId?.toString() || "root",
            });
        }
    }, [open, categoryToEdit, form]);

    const onSubmit = (values: formCategoryData) => {
        const parentId =
            values.parentId === "root" ? null : Number(values.parentId);

        const payload = {
            name: values.name,
            parentId: parentId,
        };

        if (isEditing && categoryToEdit) {
            updateMutation.mutate(
                { id: categoryToEdit.id, data: payload },
                { onSuccess: () => onOpenChange(false) }
            );
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => onOpenChange(false),
            });
        }
    };

    const renderCategoryOptions = (cats: Category[], prefix = "") => {
        return cats.map((cat) => (
            <div key={cat.id}>
                <SelectItem
                    value={cat.id.toString()}
                    disabled={cat.id === categoryToEdit?.id}
                >
                    {prefix} {cat.name}
                </SelectItem>

                {cat.children &&
                    cat.children.length > 0 &&
                    renderCategoryOptions(cat.children, prefix + "-- ")}
            </div>
        ));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? t("editTitle") : t("addTitle")}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? t("editDescription")
                            : t("addDescription")}
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
                            name="parentId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("parentLabel")}</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t("parentPlaceholder")} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem
                                                value="root"
                                                className="font-semibold text-blue-600 dark:text-blue-400"
                                            >
                                                {t("rootOption")}
                                            </SelectItem>
                                            {renderCategoryOptions(
                                                categoriesTree
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => onOpenChange(false)}
                            >
                                {tCommon("cancel")}
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className={"cursor-pointer"}
                            >
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
