"use client";
import React, { memo, useCallback } from "react";
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
            <Card>
                <CardContent className="space-y-5 pt-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                            Thông số kỹ thuật
                            {fields.length > 0 && (
                                <span className="text-muted-foreground ml-2 text-sm font-normal">
                                    ({fields.length} thông số)
                                </span>
                            )}
                        </h3>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleAddSpec}
                        >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Thêm thông số
                        </Button>
                    </div>

                    {paginatedFields.map((item, paginatedIndex) => {
                        const actualIndex = startIndex + paginatedIndex;
                        const isInitial = item.isInitial;

                        return (
                            <div
                                key={item.id}
                                className={`flex gap-4 rounded-lg border p-4 ${
                                    isInitial ? "bg-muted/50" : "bg-background"
                                }`}
                            >
                                <FormField
                                    control={control}
                                    name={`specs.${actualIndex}.attributeId`}
                                    render={({ field }) => (
                                        <FormItem className="w-1/3">
                                            <FormLabel className="flex items-center gap-2">
                                                Thuộc tính
                                                {isInitial && (
                                                    <Badge variant="secondary">
                                                        Có sẵn
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
                                                        <SelectValue placeholder="Tên thông số" />
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
                                            <FormLabel>Giá trị</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isInitial}
                                                    className={
                                                        isInitial
                                                            ? "bg-muted cursor-not-allowed"
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
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                            <p className="text-muted-foreground text-sm">
                                Chưa có thông số kỹ thuật nào.
                            </p>
                            <p className="text-muted-foreground mt-1 text-xs">
                                Nhấn "Thêm thông số" để bắt đầu.
                            </p>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t pt-4">
                            <div className="text-muted-foreground text-sm">
                                Trang {currentPage} / {totalPages}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                >
                                    Đầu
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
                                    Trước
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
                                    Sau
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                >
                                    Cuối
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
