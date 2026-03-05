"use client";

import { Separator } from "@/components/ui/separator";
import { ProductSpecificationsProps } from "@/type/product-type";

export function ProductSpecifications({
    specifications,
}: ProductSpecificationsProps) {
    if (!specifications || specifications.length === 0) return null;

    return (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:bg-transparent">
            <h3 className="mb-4 p-2 text-xl font-semibold">
                Thông số kỹ thuật
            </h3>
            <Separator className="mb-4" />
            {specifications.map((spec, index) => (
                <div key={index}>
                    <div className="grid grid-cols-2 gap-4 py-3">
                        <div className="font-semibold">
                            {spec.attributeName}
                        </div>
                        <div className="text-muted-foreground">
                            {spec.value}
                        </div>
                    </div>
                    {index < specifications.length - 1 && (
                        <Separator className="my-2" />
                    )}
                </div>
            ))}
        </div>
    );
}
