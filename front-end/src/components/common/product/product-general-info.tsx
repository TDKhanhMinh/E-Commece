"use client";
import { memo } from "react";
import { Control } from "react-hook-form";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ProductFormValues } from "@/type/product-form.types";

interface ProductGeneralInfoProps {
    control: Control<ProductFormValues>;
    categories: any[];
    brands: any[];
}

export const ProductGeneralInfo = memo(
    ({ control, categories, brands }: ProductGeneralInfoProps) => {
        return (
            <Card className="dark:bg-slate-950 dark:border-slate-800">
                <CardContent className="grid grid-cols-2 gap-6 pt-6">
                    <FormField
                        control={control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>Tên sản phẩm</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Danh mục</FormLabel>
                                <Select
                                    key={field.value}
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Chọn danh mục" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((c) => (
                                            <SelectItem
                                                key={c.id}
                                                value={c.id.toString()}
                                            >
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="brandId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Thương hiệu</FormLabel>
                                <Select
                                    key={field.value}
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Chọn thương hiệu" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {brands.map((b) => (
                                            <SelectItem
                                                key={b.id}
                                                value={b.id.toString()}
                                            >
                                                {b.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>Mô tả</FormLabel>
                                <FormControl>
                                    <Textarea {...field} className="h-32" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>
        );
    }
);

ProductGeneralInfo.displayName = "ProductGeneralInfo";
