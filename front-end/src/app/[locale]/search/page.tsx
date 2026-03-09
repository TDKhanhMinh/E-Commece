"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { FilterSidebar } from "@/components/common/ui/filter-sidebar";
import ProductItem, {
    ProductItemProps,
} from "@/components/common/product/product-item";
import { BackButton } from "@/components/common/ui/back-button";

const mapApiDataToProductItem = (apiItem: any): ProductItemProps => {
    return {
        id: apiItem.id,
        name: apiItem.name,
        slug: apiItem.slug || apiItem.id.toString(),
        image: apiItem.image || apiItem.thumbnail || "/placeholder-product.png",

        minPrice: apiItem.minPrice || apiItem.price || 0,
        maxPrice: apiItem.maxPrice || apiItem.price || 0,
        discountPercent: apiItem.discountPercent || 0,

        inStock:
            apiItem.inStock !== undefined
                ? apiItem.inStock
                : apiItem.quantity > 0,
        variantCount: apiItem.variantCount || 1,

        brandName: apiItem.brandName || apiItem.brand?.name || "T7M",
        categoryName:
            apiItem.categoryName || apiItem.category?.name || "Sản phẩm",

        rating: apiItem.rating || 0,
        reviewCount: apiItem.reviewCount || 0,
    };
};

function SearchContent() {
    const searchParams = useSearchParams();
    const keyword = searchParams.get("keyword") || "";

    const [page, setPage] = useState(0);
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const { data, isFetching, status } = useProducts({
        keyword: keyword,
        page: page,
        size: 12,
    });

    useEffect(() => {
        setPage(0);
        setAllProducts([]);
    }, [keyword]);

    useEffect(() => {
        if (data && data.content) {
            if (page === 0) {
                setAllProducts(data.content);
            } else {
                setAllProducts((prev) => {
                    const newProducts = data.content.filter(
                        (newItem: any) =>
                            !prev.some((item) => item.id === newItem.id)
                    );
                    return [...prev, ...newProducts];
                });
            }
        }
    }, [data, page]);

    const hasMore = data ? !data.last : true;

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isFetching) {
                    setPage((prevPage) => prevPage + 1);
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [hasMore, isFetching]);

    return (
        <div className="mx-auto max-w-7xl px-4 py-8">
            <BackButton />
            <div className="relative flex flex-col items-start gap-8 md:flex-row">
                <aside className="custom-scrollbar sticky top-24 z-10 w-full shrink-0 md:max-h-[calc(100vh-6rem)] md:w-1/4 md:overflow-y-auto">
                    <h1 className="mb-8 text-2xl font-bold">
                        Kết quả tìm kiếm cho:{" "}
                        <span className="text-primary">
                            &quot;{keyword}&quot;
                        </span>
                    </h1>
                    <FilterSidebar />
                </aside>

                <main className="w-full md:w-3/4">
                    {status === "pending" && page === 0 ? (
                        <div className="flex min-h-100 items-center justify-center">
                            <Loader2 className="text-primary h-8 w-8 animate-spin" />
                        </div>
                    ) : status === "error" ? (
                        <div className="text-destructive py-8 text-center">
                            Đã xảy ra lỗi khi tải dữ liệu sản phẩm.
                        </div>
                    ) : allProducts.length === 0 && !isFetching ? (
                        <div className="text-muted-foreground py-16 text-center text-lg">
                            Không tìm thấy sản phẩm nào phù hợp.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                            {allProducts.map((product: any) => (
                                <ProductItem
                                    key={product.id}
                                    item={mapApiDataToProductItem(product)}
                                />
                            ))}
                        </div>
                    )}

                    <div
                        ref={loadMoreRef}
                        className="mt-8 flex h-20 items-center justify-center"
                    >
                        {isFetching && page > 0 ? (
                            <Loader2 className="text-primary h-6 w-6 animate-spin" />
                        ) : !hasMore && allProducts.length > 0 ? (
                            <p className="text-muted-foreground text-sm">
                                Đã hiển thị tất cả sản phẩm.
                            </p>
                        ) : null}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense
            fallback={
                <div className="flex h-[50vh] items-center justify-center">
                    <Loader2 className="text-primary h-8 w-8 animate-spin" />
                </div>
            }
        >
            <SearchContent />
        </Suspense>
    );
}
