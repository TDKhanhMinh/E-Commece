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
import { BackButton } from "@/components/common/ui/back-button";

function ProductDetails() {
    const params = useParams();
    const slug = params.slug as string;

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

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
        );
    }

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
                    <BackButton />
                    <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
                        <ProductImageGallery
                            images={allImages}
                            currentImageIndex={currentImageIndex}
                            onImageChange={setCurrentImageIndex}
                            productName={product.name}
                            discountPercent={discountPercent}
                        />

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
            <ProductReviews
                productSlug={slug}
                productId={product.id}
                productName={product.name}
            />
            <HomeQuestions />
            <Subscribe />
        </>
    );
}

export default ProductDetails;
