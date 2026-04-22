"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { SkuManager } from "../sku/sku-manager";
import { ProductGeneralInfo } from "./product-general-info";
import { ProductSpecs } from "./product-specs";
import { ProductImageManager } from "./product-image-manager";
import {
    ProductFormProps,
    ProductFormValues,
} from "../../../type/product-form.types";
import {
    useCreateProduct,
    useProductDetail,
    useUpdateProduct,
} from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { useBrands } from "@/hooks/use-brands";
import { useAttributes } from "@/hooks/use-attributes";
import ProductFormSkeleton from "@/components/skeleton/product-form-skeleton";

export default function ProductForm({ productId }: ProductFormProps) {
    const t = useTranslations("products.form");
    const router = useRouter();
    const isEditMode = Boolean(productId);
    const [isImageUploading, setIsImageUploading] = useState(false);

    const { data: productData, isLoading } = useProductDetail(
        productId as number
    );
    const product = productData as any;
    console.log(product);

    // Fetch all categories for dropdown (no pagination)
    const { data: categoriesData, isLoading: categoriesLoading } =
        useCategories({ size: 1000 });
    const categories = (categoriesData as any)?.content || [];

    // Fetch all brands for dropdown (no pagination)
    const { data: brandsData, isLoading: brandsLoading } = useBrands({
        size: 1000,
    });
    const brands = (brandsData as any)?.content || [];

    const { data: attributesData, isLoading: attributeLoading } = useAttributes(
        { size: 1000 }
    );
    const attributes = (attributesData as any)?.content || [];

    const createMutation = useCreateProduct();
    const updateMutation = useUpdateProduct();

    const form = useForm<ProductFormValues>({
        defaultValues: {
            name: "",
            description: "",
            categoryId: "",
            brandId: "",
            images: [],
            specs: [],
        },
    });

    const { control, reset, handleSubmit } = form;

    useEffect(() => {
        if (!product || !categories.length || !brands.length) return;

        reset({
            name: product.name,
            description: product.description,
            categoryId: product.categoryId?.toString() ?? "",
            brandId: product.brandId?.toString() ?? "",
            images: product.images ?? [],
            specs: product.specifications.map((s: any) => ({
                attributeId: s.attributeId?.toString() ?? "",
                value: s.value,
                isInitial: true,
            })),
        });
    }, [product, categories.length, brands.length, reset]);

    const onSubmit = useCallback(
        (values: ProductFormValues) => {
            if (isImageUploading) return;

            const payload = {
                name: values.name,
                description: values.description,
                categoryId: Number(values.categoryId),
                brandId: Number(values.brandId),
                images: values.images,
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
                onSuccess: (res: any) =>
                    router.push(`/admin/products/${res.id}`),
            });
        },
        [isEditMode, productId, createMutation, updateMutation, router, isImageUploading]
    );

    const pageTitle = useMemo(
        () =>
            isEditMode
                ? t("editTitle", { name: product?.name ?? "" })
                : t("newTitle"),
        [isEditMode, product?.name, t]
    );

    const showSkeleton =
        isEditMode &&
        (isLoading || categoriesLoading || brandsLoading || attributeLoading);

    if (showSkeleton) return <ProductFormSkeleton />;

    return (
        <div className="m-4 space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>

            <Tabs defaultValue="general">
                <TabsList>
                    <TabsTrigger value="general">{t("tabs.general")}</TabsTrigger>
                    <TabsTrigger value="skus" disabled={!isEditMode}>
                        {t("tabs.skus")}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Form {...form}>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <ProductGeneralInfo
                                control={control}
                                categories={categories}
                                brands={brands}
                            />

                            <FormField
                                control={control}
                                name="images"
                                render={({ field }) => (
                                    <ProductImageManager
                                        value={field.value}
                                        onChange={field.onChange}
                                        isUploading={isImageUploading}
                                        onUploadingChange={setIsImageUploading}
                                    />
                                )}
                            />

                            <ProductSpecs
                                control={control}
                                attributes={attributes}
                            />

                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="px-10"
                                    disabled={isImageUploading}
                                >
                                    {t("save")}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </TabsContent>

                <TabsContent value="skus">
                    <Card className="dark:bg-slate-950 dark:border-slate-800">
                        <CardContent className="pt-6">
                            {product && <SkuManager product={product} />}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
