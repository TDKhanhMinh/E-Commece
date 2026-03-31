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
import { ProductFormValues } from "@/type/product-form.types";

interface ProductGeneralInfoProps {
    control: Control<ProductFormValues>;
    categories: any[];
    brands: any[];
}

export const ProductGeneralInfo = memo(
    ({ control, categories, brands }: ProductGeneralInfoProps) => {
        return (
            <Card>
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
                        render={({ field }) => {
                            // Tìm tên danh mục từ ID
                            const selectedCategory = categories.find(
                                (c) => c.id.toString() === field.value
                            );

                            return (
                                <FormItem>
                                    <FormLabel>Danh mục</FormLabel>
                                    <FormControl>
                                        <Input
                                            value={
                                                selectedCategory?.name ||
                                                "Chưa chọn danh mục"
                                            }
                                            className="cursor-not-allowed bg-gray-100"
                                        />
                                    </FormControl>
                                </FormItem>
                            );
                        }}
                    />

                    <FormField
                        control={control}
                        name="brandId"
                        render={({ field }) => {
                            // Tìm tên thương hiệu từ ID
                            const selectedBrand = brands.find(
                                (b) => b.id.toString() === field.value
                            );

                            return (
                                <FormItem>
                                    <FormLabel>Thương hiệu</FormLabel>
                                    <FormControl>
                                        <Input
                                            value={
                                                selectedBrand?.name ||
                                                "Chưa chọn thương hiệu"
                                            }
                                            className="cursor-not-allowed bg-gray-100"
                                        />
                                    </FormControl>
                                </FormItem>
                            );
                        }}
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
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>
        );
    }
);

ProductGeneralInfo.displayName = "ProductGeneralInfo";
