"use client";

import { Button } from "@/components/ui/button";
import { ProductVariantSelectorProps } from "@/type/product-type";

export function ProductVariantSelector({
    attributeGroups,
    selectedAttributes,
    onAttributeChange,
    variants,
}: ProductVariantSelectorProps) {
    return (
        <>
            {Object.entries(attributeGroups).map(([attributeName, values]) => (
                <div key={attributeName} className="mb-6 sm:mb-8">
                    <h3 className="mb-3 text-base font-bold capitalize sm:mb-4 sm:text-lg lg:text-xl">
                        Chọn {attributeName}
                    </h3>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                        {Array.from(values).map((value) => {
                            const isSelected =
                                selectedAttributes[attributeName] === value;

                            // Check if this option is available
                            const isAvailable = variants.some((sku: any) => {
                                const tempSelected = {
                                    ...selectedAttributes,
                                    [attributeName]: value,
                                };
                                return (
                                    Object.entries(tempSelected).every(
                                        ([key, val]) =>
                                            sku.attributes[key] === val
                                    ) && sku.stock > 0
                                );
                            });

                            return (
                                <Button
                                    key={value}
                                    variant={isSelected ? "default" : "outline"}
                                    className={`h-10 min-w-[80px] rounded-xl px-4 text-xs transition-all sm:h-11 sm:min-w-[100px] sm:text-sm ${
                                        isSelected
                                            ? "border-primary ring-primary/20 ring-2"
                                            : ""
                                    } ${
                                        !isAvailable && !isSelected
                                            ? "cursor-not-allowed opacity-50"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        if (isAvailable || isSelected) {
                                            onAttributeChange(
                                                attributeName,
                                                value
                                            );
                                        }
                                    }}
                                    disabled={!isAvailable && !isSelected}
                                    aria-label={`Chọn ${attributeName}: ${value}`}
                                    aria-pressed={isSelected}
                                >
                                    {value}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </>
    );
}
