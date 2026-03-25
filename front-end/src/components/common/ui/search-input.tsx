"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useProducts } from "@/hooks/use-products";
import { formatCurrency } from "@/lib/format-price";

export function GlobalSearch() {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);
        return () => clearTimeout(timer);
    }, [query]);

    const { data, isFetching } = useProducts({
        keyword: debouncedQuery,
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (query.length > 0) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [query]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && query.trim() !== "") {
            setIsOpen(false);
            router.push(`/search?keyword=${encodeURIComponent(query.trim())}`);
        }
    };
    // @ts-ignore
    const suggestedProducts = (data?.content as unknown as any) || [];

    const isLoading =
        isFetching || (query !== debouncedQuery && query.length > 0);

    return (
        <div
            ref={searchRef}
            className="relative hidden w-full max-w-sm lg:block"
        >
            <div className="relative flex items-center">
                <Search className="text-muted-foreground absolute left-3 h-4 w-4" />
                <Input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length > 0 && setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    className="bg-muted/50 focus-visible:ring-primary h-10 w-full rounded-full pr-10 pl-9"
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery("");
                            setIsOpen(false);
                        }}
                        className="hover:bg-muted absolute right-2 flex h-6 w-6 items-center justify-center rounded-full bg-transparent"
                    >
                        <X className="text-muted-foreground h-4 w-4" />
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="bg-popover text-popover-foreground absolute top-full mt-2 w-full overflow-hidden rounded-xl border shadow-lg">
                    {isLoading ? (
                        <div className="flex items-center justify-center p-6 text-sm">
                            <Loader2 className="text-primary mr-2 h-4 w-4 animate-spin" />
                            Đang tìm kiếm...
                        </div>
                    ) : suggestedProducts.length > 0 ? (
                        <div className="max-h-100 overflow-y-auto p-2">
                            <p className="text-muted-foreground mb-2 px-2 text-xs font-semibold uppercase">
                                Sản phẩm gợi ý
                            </p>
                            {suggestedProducts
                                .slice(0, 5)
                                .map((product: any) => (
                                    <Link
                                        key={product.id}
                                        href={`/product/${product.slug}`}
                                        onClick={() => setIsOpen(false)}
                                        className="hover:bg-muted flex items-center gap-3 rounded-lg p-2 transition-colors"
                                    >
                                        <div className="bg-muted/50 relative h-12 w-12 shrink-0 overflow-hidden rounded-md">
                                            <Image
                                                src={
                                                    product.image ||
                                                    product.thumbnail ||
                                                    "/placeholder-image.jpg"
                                                }
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="line-clamp-1 text-sm font-medium">
                                                {product.name}
                                            </span>
                                            <span className="text-primary text-xs font-semibold">
                                                {formatCurrency(
                                                    product.minPrice
                                                )}
                                                -
                                                {formatCurrency(
                                                    product.maxPrice
                                                )}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            <div className="mt-2 border-t p-2 pb-0">
                                <Link
                                    href={`/search?keyword=${encodeURIComponent(query)}`}
                                    onClick={() => setIsOpen(false)}
                                    className="text-primary block text-center text-sm font-medium hover:underline"
                                >
                                    Xem tất cả kết quả cho &quot;{query}&quot;
                                </Link>
                            </div>
                        </div>
                    ) : debouncedQuery.length > 0 ? (
                        <div className="text-muted-foreground p-6 text-center text-sm">
                            Không tìm thấy sản phẩm nào phù hợp với &quot;
                            {debouncedQuery}&quot;.
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
