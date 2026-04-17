"use client";
import React, { memo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { PlusCircle, Trash2 } from "lucide-react";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductFormValues } from "@/type/product-form.types";
import { Control, useFieldArray } from "react-hook-form";

interface ProductSpecsProps {
    control: Control<ProductFormValues>;
    attributes: any[];
}

export const ProductSpecs = memo(
    ({ control, attributes }: ProductSpecsProps) => {
        const t = useTranslations("products.form.specs");
        const { fields, append, remove } = useFieldArray({
            control,
            name: "specs",
        });

        const [currentPage, setCurrentPage] = React.useState(1);
        const itemsPerPage = 5;

        const handleAddSpec = useCallback(() => {
            append({
                attributeId: "",
                value: "",
                isInitial: false,
            });
        }, [append]);

        const totalPages = Math.ceil(fields.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedFields = fields.slice(startIndex, endIndex);

        React.useEffect(() => {
            if (currentPage > totalPages && totalPages > 0) {
                setCurrentPage(totalPages);
            }
        }, [currentPage, totalPages]);

        return (
            <Card className="dark:bg-slate-950 dark:border-slate-800">
                <CardContent className="space-y-5 pt-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                            {t("title")}
                            {fields.length > 0 && (
                                <span className="text-muted-foreground ml-2 text-sm font-normal">
                                    {t("count", { count: fields.length })}
                                </span>
                            )}
                        </h3>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleAddSpec}
                        >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            {t("add")}
                        </Button>
                    </div>

                    {paginatedFields.map((item, paginatedIndex) => {
                        const actualIndex = startIndex + paginatedIndex;
                        const isInitial = item.isInitial;

                        return (
                            <div
                                key={item.id}
                                className={`flex gap-4 rounded-lg border dark:border-slate-800 p-4 ${
                                    isInitial ? "bg-muted/50 dark:bg-slate-900/50" : "bg-background dark:bg-slate-900"
                                }`}
                            >
                                <FormField
                                    control={control}
                                    name={`specs.${actualIndex}.attributeId`}
                                    render={({ field }) => (
                                        <FormItem className="w-1/3">
                                            <FormLabel className="flex items-center gap-2">
                                                {t("attribute")}
                                                {isInitial && (
                                                    <Badge variant="secondary">
                                                        {t("available")}
                                                    </Badge>
                                                )}
                                            </FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                disabled={isInitial}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t("placeholder")} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {attributes.map((a) => (
                                                        <SelectItem
                                                            key={a.id}
                                                            value={a.id.toString()}
                                                        >
                                                            {a.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name={`specs.${actualIndex}.value`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>{t("value")}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isInitial}
                                                    className={
                                                        isInitial
                                                            ? "bg-muted dark:bg-slate-800 cursor-not-allowed"
                                                            : ""
                                                    }
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => remove(actualIndex)}
                                >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        );
                    })}

                    {fields.length === 0 && (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed dark:border-slate-800 p-8 text-center">
                            <p className="text-muted-foreground text-sm">
                                {t("empty")}
                            </p>
                            <p className="text-muted-foreground mt-1 text-xs">
                                {t("emptySubtitle")}
                            </p>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t dark:border-slate-800 pt-4">
                            <div className="text-muted-foreground text-sm">
                                {t("pagination.info", {
                                    current: currentPage,
                                    total: totalPages,
                                })}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                >
                                    {t("pagination.first")}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setCurrentPage((p) =>
                                            Math.max(1, p - 1)
                                        )
                                    }
                                    disabled={currentPage === 1}
                                >
                                    {t("pagination.previous")}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setCurrentPage((p) =>
                                            Math.min(totalPages, p + 1)
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                >
                                    {t("pagination.next")}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                >
                                    {t("pagination.last")}
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    }
);

ProductSpecs.displayName = "ProductSpecs";
