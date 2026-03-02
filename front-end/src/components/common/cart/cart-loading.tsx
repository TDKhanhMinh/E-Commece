import { Skeleton } from "@/components/ui/skeleton";

export function CartLoading() {
    return (
        <div className="container mx-auto max-w-6xl px-4 py-8">
            <div className="mb-6">
                <Skeleton className="h-10 w-40" />
            </div>
            <Skeleton className="mb-8 h-10 w-64" />
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                    ))}
                </div>
                <div className="lg:col-span-1">
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        </div>
    );
}
