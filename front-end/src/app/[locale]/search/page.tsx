"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, SlidersHorizontal, Search } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { FilterSidebar } from "@/components/common/ui/filter-sidebar";
import ProductItem, {
    ProductItemProps,
} from "@/components/common/product/product-item";
import { BackButton } from "@/components/common/ui/back-button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
        if (
            data && //@ts-ignore
            data.content
        ) {
            if (page === 0) {
                //@ts-ignore
                setAllProducts(data.content);
            } else {
                setAllProducts((prev) => {
                    //@ts-ignore
                    const newProducts = data.content.filter(
                        (newItem: any) =>
                            !prev.some((item) => item.id === newItem.id)
                    );
                    return [...prev, ...newProducts];
                });
            }
        }
    }, [data, page]);
    //@ts-ignore
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
        <div className="mx-auto max-w-7xl px-4 py-4 sm:py-8">
            <div className="mb-4 flex items-center justify-between gap-4 md:mb-8">
                <div className="flex items-center gap-2 sm:gap-4">
                    <BackButton />
                    <h1 className="text-lg leading-tight font-bold sm:text-2xl">
                        <span className="hidden sm:inline">Kết quả cho: </span>
                        <span className="text-primary truncate break-all">
                            &quot;{keyword}&quot;
                        </span>
                    </h1>
                </div>

                {/* Mobile Filter Trigger */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                                <SlidersHorizontal className="size-4" />
                                <span>Bộ lọc</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] p-0">
                            <SheetHeader className="border-b p-6 text-left">
                                <SheetTitle className="flex items-center gap-2">
                                    <SlidersHorizontal className="size-5" />
                                    Bộ lọc tìm kiếm
                                </SheetTitle>
                            </SheetHeader>
                            <div className="overflow-y-auto p-6">
                                <FilterSidebar />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <div className="relative flex flex-col items-start gap-8 md:flex-row">
                <aside className="custom-scrollbar sticky top-24 z-10 hidden w-full shrink-0 md:block md:max-h-[calc(100vh-6rem)] md:w-1/4 md:overflow-y-auto">
                    <FilterSidebar />
                </aside>

                <main className="w-full md:w-3/4">
                    {status === "pending" && page === 0 ? (
                        <div className="flex h-60 items-center justify-center">
                            <Loader2 className="text-primary h-8 w-8 animate-spin" />
                        </div>
                    ) : status === "error" ? (
                        <div className="text-destructive py-8 text-center">
                            Đã xảy ra lỗi khi tải dữ liệu sản phẩm.
                        </div>
                    ) : allProducts.length === 0 && !isFetching ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="mb-4 rounded-full bg-slate-100 p-6 dark:bg-slate-800">
                                <Search className="size-12 text-slate-300" />
                            </div>
                            <p className="text-lg font-medium text-slate-500">
                                Không tìm thấy sản phẩm nào phù hợp.
                            </p>
                            <p className="text-muted-foreground text-sm">
                                Hãy thử thay đổi từ khóa hoặc bộ lọc của bạn.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
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
                            <Badge
                                variant="outline"
                                className="px-4 py-1 text-xs font-normal"
                            >
                                Đã hiển thị tất cả sản phẩm
                            </Badge>
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
