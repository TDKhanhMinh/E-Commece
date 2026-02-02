"use client";

import { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { PlusCircle, Trash2 } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { SkuManager } from "./sku-manager";
import {
    useCreateProduct,
    useProductDetail,
    useUpdateProduct,
} from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { useBrands } from "@/hooks/use-brands";
import { useAttributes } from "@/hooks/use-attributes";
import ProductFormSkeleton from "@/components/skeleton/product-form-skeleton";

interface ProductFormProps {
    productId?: number;
}

interface ProductFormValues {
    name: string;
    description: string;
    categoryId: string;
    brandId: string;
    specs: {
        attributeId: string;
        value: string;
        isInitial?: boolean;
    }[];
}

export default function ProductForm({ productId }: ProductFormProps) {
    const router = useRouter();
    const isEditMode = Boolean(productId);

    const { data: product, isLoading } = useProductDetail(productId as number);
    const { data: categories = [], isLoading: categoriesLoading } =
        useCategories();
    const { data: brands = [], isLoading: brandsLoading } = useBrands();
    const { data: attributes = [], isLoading: attributeLoading } =
        useAttributes();

    const createMutation = useCreateProduct();
    const updateMutation = useUpdateProduct();

    const form = useForm<ProductFormValues>({
        defaultValues: {
            name: "",
            description: "",
            categoryId: "",
            brandId: "",
            specs: [],
        },
    });

    const { control, reset, handleSubmit } = form;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "specs",
    });

    useEffect(() => {
        if (!product || !categories.length || !brands.length) return;

        reset({
            name: product.name,
            description: product.description,
            categoryId: product.categoryId?.toString() ?? "",
            brandId: product.brandId?.toString() ?? "",
            specs: product.specifications.map((s: any) => ({
                attributeId: s.attributeId?.toString() ?? "",
                value: s.value,
                isInitial: true,
            })),
        });
    }, [product, categories, brands, reset]);

    const onSubmit = (values: ProductFormValues) => {
        const payload = {
            ...values,
            categoryId: Number(values.categoryId),
            brandId: Number(values.brandId),
            specs: values.specs.map((s) => ({
                attributeId: Number(s.attributeId),
                value: s.value,
            })),
        };

        if (isEditMode && productId) {
            updateMutation.mutate(
                { id: productId, data: payload },
                { onSuccess: () => router.push("/admin/products") }
            );
            return;
        }

        createMutation.mutate(payload, {
            onSuccess: (res) => router.push(`/admin/products/${res.id}`),
        });
    };

    const pageTitle = useMemo(
        () =>
            isEditMode
                ? `Sửa sản phẩm: ${product?.name ?? ""}`
                : "Tạo sản phẩm mới",
        [isEditMode, product]
    );

    if (
        isEditMode &&
        isLoading &&
        categoriesLoading &&
        brandsLoading &&
        attributeLoading
    )
        return <ProductFormSkeleton />;

    return (
        <div className="m-4 space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>

            <Tabs defaultValue="general">
                <TabsList>
                    <TabsTrigger value="general">Thông tin chung</TabsTrigger>
                    <TabsTrigger value="skus" disabled={!isEditMode}>
                        Biến thể (SKU)
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Form {...form}>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <Card>
                                <CardContent className="grid grid-cols-2 gap-6 pt-6">
                                    <FormField
                                        control={control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="col-span-2">
                                                <FormLabel>
                                                    Tên sản phẩm
                                                </FormLabel>
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
                                                    value={field.value}
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn danh mục" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {categories.map(
                                                            (c: any) => (
                                                                <SelectItem
                                                                    key={c.id}
                                                                    value={c.id.toString()}
                                                                >
                                                                    {c.name}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="brandId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Thương hiệu
                                                </FormLabel>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn thương hiệu" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {brands.map(
                                                            (b: any) => (
                                                                <SelectItem
                                                                    key={b.id}
                                                                    value={b.id.toString()}
                                                                >
                                                                    {b.name}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
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
                                                    <Textarea
                                                        {...field}
                                                        className="h-32"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="space-y-5 pt-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold">
                                            Thông số kỹ thuật
                                        </h3>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                append({
                                                    attributeId: "",
                                                    value: "",
                                                    isInitial: false,
                                                })
                                            }
                                        >
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            Thêm thông số
                                        </Button>
                                    </div>

                                    {fields.map((item, index) => {
                                        const isInitial = item.isInitial;

                                        return (
                                            <div
                                                key={item.id}
                                                className={`flex gap-4 rounded-lg border p-4 ${
                                                    isInitial
                                                        ? "bg-muted/50"
                                                        : "bg-background"
                                                }`}
                                            >
                                                <FormField
                                                    control={control}
                                                    name={`specs.${index}.attributeId`}
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
                                                                value={
                                                                    field.value
                                                                }
                                                                onValueChange={
                                                                    field.onChange
                                                                }
                                                                disabled={
                                                                    isInitial
                                                                }
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Tên thông số" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {attributes.map(
                                                                        (
                                                                            a: any
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    a.id
                                                                                }
                                                                                value={a.id.toString()}
                                                                            >
                                                                                {
                                                                                    a.name
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={control}
                                                    name={`specs.${index}.value`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex-1">
                                                            <FormLabel>
                                                                Giá trị
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    disabled={
                                                                        isInitial
                                                                    }
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
                                                    onClick={() =>
                                                        remove(index)
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </CardContent>
                            </Card>

                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="px-10"
                                >
                                    Lưu sản phẩm
                                </Button>
                            </div>
                        </form>
                    </Form>
                </TabsContent>

                <TabsContent value="skus">
                    <Card>
                        <CardContent className="pt-6">
                            {product && <SkuManager product={product} />}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
