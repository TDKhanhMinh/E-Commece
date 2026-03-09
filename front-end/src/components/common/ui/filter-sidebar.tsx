"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function FilterSidebar() {
    return (
        <div className="sticky top-24 space-y-6 rounded-xl border p-5">
            <div>
                <h3 className="mb-4 text-lg font-semibold">Danh mục</h3>
                <div className="space-y-3">
                    {[
                        "iPhone 15 Series",
                        "iPhone 14 Series",
                        "Phụ kiện",
                        "MacBook",
                    ].map((category) => (
                        <div
                            key={category}
                            className="flex items-center space-x-2"
                        >
                            <Checkbox id={`cat-${category}`} />
                            <Label
                                htmlFor={`cat-${category}`}
                                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {category}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <hr />

            <div>
                <h3 className="mb-4 text-lg font-semibold">Mức giá</h3>
                <div className="flex items-center gap-2">
                    <Input type="number" placeholder="Từ" className="h-9" />
                    <span className="text-muted-foreground">-</span>
                    <Input type="number" placeholder="Đến" className="h-9" />
                </div>
                <Button className="mt-4 w-full" size="sm">
                    Áp dụng
                </Button>
            </div>
        </div>
    );
}
