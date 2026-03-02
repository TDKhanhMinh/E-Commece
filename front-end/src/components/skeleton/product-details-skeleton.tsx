import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailsSkeleton() {
    return (
        <div className="bg-background min-h-screen w-full">
            <section className="container max-w-7xl px-4 py-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Image gallery skeleton */}
                    <div className="space-y-4">
                        <Skeleton className="aspect-square w-full rounded-xl" />
                        <div className="flex gap-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton
                                    key={i}
                                    className="h-20 w-20 rounded-md"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Product info skeleton */}
                    <div className="space-y-6">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-6 w-1/3" />

                        <div className="space-y-2">
                            <Skeleton className="h-5 w-1/2" />
                            <Skeleton className="h-4 w-1/3" />
                        </div>

                        {/* Attributes */}
                        <div className="space-y-4">
                            {Array.from({ length: 2 }).map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <div className="flex gap-2">
                                        {Array.from({ length: 4 }).map(
                                            (_, j) => (
                                                <Skeleton
                                                    key={j}
                                                    className="h-10 w-20 rounded-md"
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Skeleton className="h-12 w-full rounded-md" />
                    </div>
                </div>
            </section>

            {/* Below sections */}
            <section className="container max-w-7xl space-y-8 px-4 py-12">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </section>
        </div>
    );
}
