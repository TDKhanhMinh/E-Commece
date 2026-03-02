"use client";

import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import ProductAboutUs from "@/features/product/product-about-us";
import HomeSaleProducts from "@/features/home/home-sale-products";
import ProductReviews from "@/features/product/product-reviews";
import { HomeQuestions } from "@/features/home/home-questions";
import { Subscribe } from "@/components/common";
import { useProductData } from "@/hooks/use-product-data";
import { ProductInfo } from "@/features/product/product-info";
import { ProductImageGallery } from "@/features/product/product-image-gallery";
import { ProductStructuredData } from "@/features/product/product-structured-data";

function ProductDetails() {
    const params = useParams();
    const slug = params.slug as string;

    // Use custom hook for all product data logic
    const {
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
    } = useProductData(slug);

    // Loading state
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
        );
    }

    // Product not found
    if (!product) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">
                        Không tìm thấy sản phẩm
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Sản phẩm bạn đang tìm không tồn tại hoặc đã bị xóa.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* SEO Structured Data */}
            <ProductStructuredData
                product={{
                    name: product.name,
                    description: product.description,
                    image: allImages[0],
                    brand: product.brand,
                    rating: product.rating,
                    reviewCount: product.reviewCount,
                }}
                sku={
                    selectedSku
                        ? {
                              skuCode: selectedSku.skuCode,
                              price: originalPrice,
                              salePrice: salePrice,
                              stock: selectedSku.stock,
                          }
                        : null
                }
                slug={slug}
            />

            <article
                className="bg-background flex min-h-screen w-full flex-col items-center justify-center"
                itemScope
                itemType="https://schema.org/Product"
            >
                <section className="container w-full max-w-7xl px-4 py-8">
                    <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Image Gallery */}
                        <ProductImageGallery
                            images={allImages}
                            currentImageIndex={currentImageIndex}
                            onImageChange={setCurrentImageIndex}
                            productName={product.name}
                            discountPercent={discountPercent}
                        />

                        {/* Product Info */}
                        <ProductInfo
                            product={product}
                            selectedSku={selectedSku}
                            discountPercent={discountPercent}
                            salePrice={salePrice}
                            originalPrice={originalPrice}
                            attributeGroups={attributeGroups}
                            selectedAttributes={selectedAttributes}
                            onAttributeChange={handleAttributeChange}
                        />
                    </div>
                </section>
                <ProductAboutUs />
            </article>
            <HomeSaleProducts />
            <ProductReviews />
            <HomeQuestions />
            <Subscribe />
        </>
    );
}

export default ProductDetails;
