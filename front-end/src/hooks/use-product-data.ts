"use client";

import { useEffect, useMemo, useState } from "react";
import { useProductDetailBySlug } from "@/hooks/use-products";

export function useProductData(slug: string) {
    const { data: productData, isLoading } = useProductDetailBySlug(slug);
    const product = productData as any;

    const [selectedSku, setSelectedSku] = useState<any>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedAttributes, setSelectedAttributes] = useState<
        Record<string, string>
    >({});

    // Get all images
    const allImages = useMemo(() => {
        if (!product) return [];
        const images: string[] = [];

        if (selectedSku?.imagesDetails) {
            images.push(...selectedSku.imagesDetails);
        } else if (product.variants?.[0]?.imagesDetails) {
            images.push(...product.variants[0].imagesDetails);
        }

        return images.length > 0 ? images : ["/placeholder-product.png"];
    }, [product, selectedSku]);

    // Group SKUs by attribute
    const attributeGroups = useMemo(() => {
        if (!product?.variants) return {};

        const groups: Record<string, Set<string>> = {};

        product.variants.forEach((sku: any) => {
            Object.entries(sku.attributes).forEach(([key, value]) => {
                if (!groups[key]) {
                    groups[key] = new Set();
                }
                groups[key].add(value as string);
            });
        });

        return groups;
    }, [product]);

    // Set default selected SKU
    useEffect(() => {
        if (product?.variants?.length > 0 && !selectedSku) {
            const firstSku = product.variants[0];
            setSelectedSku(firstSku);
            setSelectedAttributes(firstSku.attributes || {});
        }
    }, [product, selectedSku]);

    // Update selected SKU based on attributes
    useEffect(() => {
        if (!product?.variants || Object.keys(selectedAttributes).length === 0)
            return;

        const matchingSku = product.variants.find((sku: any) => {
            return Object.entries(selectedAttributes).every(([key, value]) => {
                return sku.attributes[key] === value;
            });
        });

        if (matchingSku) {
            setSelectedSku(matchingSku);
            setCurrentImageIndex(0);
        }
    }, [selectedAttributes, product]);

    // Calculate prices
    const calculateSalePrice = (price: number, discount: number) => {
        return price * (1 - discount / 100);
    };

    const salePrice = selectedSku
        ? selectedSku.salePrice ||
          selectedSku.finalPrice ||
          calculateSalePrice(
              selectedSku.price,
              selectedSku.discountPercent || 0
          )
        : 0;

    const originalPrice = selectedSku?.price || 0;
    const discountPercent = selectedSku?.discountPercent || 0;

    // Handle attribute change
    const handleAttributeChange = (attributeName: string, value: string) => {
        setSelectedAttributes((prev) => ({
            ...prev,
            [attributeName]: value,
        }));
    };

    return {
        product,
        isLoading,
        selectedSku,
        currentImageIndex,
        setCurrentImageIndex,
        selectedAttributes,
        handleAttributeChange,
        allImages,
        attributeGroups,
        salePrice,
        originalPrice,
        discountPercent,
    };
}
