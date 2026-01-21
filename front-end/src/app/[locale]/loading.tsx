import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="container mx-auto space-y-8 p-6">
            <div className="space-y-2">
                <Skeleton className="h-10 w-62.5 animate-pulse" />
                <Skeleton className="h-4 w-87.5 opacity-70" />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-col space-y-3">
                        <Skeleton className="h-50 w-full rounded-xl" />

                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />

                            <Skeleton className="h-4 w-[80%]" />
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-4 w-25" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
