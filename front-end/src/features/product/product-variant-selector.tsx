"use client";

import { Button } from "@/components/ui/button";

interface ProductVariantSelectorProps {
    attributeGroups: Record<string, Set<string>>;
    selectedAttributes: Record<string, string>;
    onAttributeChange: (attributeName: string, value: string) => void;
    variants: any[];
}

export function ProductVariantSelector({
    attributeGroups,
    selectedAttributes,
    onAttributeChange,
    variants,
}: ProductVariantSelectorProps) {
    return (
        <>
            {Object.entries(attributeGroups).map(([attributeName, values]) => (
                <div key={attributeName} className="mb-8">
                    <h3 className="mb-4 text-xl font-bold capitalize">
                        Chọn {attributeName}
                    </h3>
                    <div className="flex flex-wrap gap-3">
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
                                    className={`min-w-[100px] rounded-xl transition-all ${
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
