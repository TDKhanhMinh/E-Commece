import { Skeleton } from "@/components/ui/skeleton";

function ProductFormSkeleton() {
    return (
        <div className="space-y-8">
            {/* Title */}
            <Skeleton className="h-9 w-1/3" />

            {/* Tabs */}
            <div className="flex gap-2">
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-40" />
            </div>

            {/* Card: Basic Info */}
            <div className="bg-background space-y-6 rounded-lg border dark:border-slate-800 p-6">
                <Skeleton className="h-5 w-40" />

                <Skeleton className="h-10 w-full" />

                <div className="grid grid-cols-2 gap-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>

                <Skeleton className="h-32 w-full" />
            </div>

            {/* Card: Specs */}
            <div className="bg-background space-y-4 rounded-lg border dark:border-slate-800 p-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-9 w-36" />
                </div>

                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 rounded-lg border dark:border-slate-800 p-4">
                        <Skeleton className="h-10 w-1/3" />
                        <Skeleton className="h-10 flex-1" />
                        <Skeleton className="h-10 w-10" />
                    </div>
                ))}
            </div>

            {/* Submit */}
            <div className="flex justify-end">
                <Skeleton className="h-12 w-40" />
            </div>
        </div>
    );
}
export default ProductFormSkeleton;
