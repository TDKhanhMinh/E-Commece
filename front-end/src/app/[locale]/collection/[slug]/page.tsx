import { MOCK_CAROUSEL_PRODUCT_ITEMS } from "../../../../../mock";
import ProductItem from "@/components/common/product/product-item";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

function Collection() {
    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 px-1 sm:pr-5">
                <div className="flex items-center justify-between w-full sm:w-auto">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        50 products
                    </h3>

                    {/* Mobile/Tablet Filter Trigger */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="lg:hidden flex items-center gap-2 h-9 px-3"
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                                <span>Bộ lọc</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                            <SheetHeader className="text-left pb-4">
                                <SheetTitle className="text-xl font-bold">
                                    Filters
                                </SheetTitle>
                            </SheetHeader>
                            <Separator />
                            <div className="py-4">
                                <Accordion
                                    type="single"
                                    collapsible
                                    className="w-full space-y-2"
                                >
                                    <AccordionItem
                                        value={`Condition`}
                                        className="border-b-0"
                                    >
                                        <AccordionTrigger className="py-2 text-left text-base font-semibold hover:no-underline">
                                            Condition
                                        </AccordionTrigger>
                                        <AccordionContent className="flex flex-col gap-4 pt-2">
                                            <div className="flex items-center gap-3">
                                                <Checkbox id="m-condition-ecofriendly" />
                                                <Label
                                                    htmlFor="m-condition-ecofriendly"
                                                    className="text-sm font-medium"
                                                >
                                                    Ecofriendly
                                                </Label>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Checkbox id="m-condition-excellent" />
                                                <Label
                                                    htmlFor="m-condition-excellent"
                                                    className="text-sm font-medium"
                                                >
                                                    Excellent
                                                </Label>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Checkbox id="m-condition-good" />
                                                <Label
                                                    htmlFor="m-condition-good"
                                                    className="text-sm font-medium"
                                                >
                                                    Good
                                                </Label>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                <select className="h-10 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto dark:bg-slate-950 dark:border-slate-800">
                    <option value="relevance">Sort by relevance</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="newest-first">Newest First</option>
                </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 py-4">
                {MOCK_CAROUSEL_PRODUCT_ITEMS.map((product: any) => (
                    <div key={product.id} className="flex flex-col">
                        <ProductItem item={product} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Collection;
