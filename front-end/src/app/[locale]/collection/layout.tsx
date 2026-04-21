"use client";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Subscribe } from "@/components/common";

function CollectionLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <div className="col-span-12 flex h-24 sm:h-32 flex-row items-center justify-center bg-slate-50 dark:bg-slate-900 border-b">
                <span className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight">Androids</span>
            </div>
            <div className="mb-8 grid grid-cols-1 lg:grid-cols-12 px-4 sm:px-6 lg:px-8 gap-6 sm:gap-8 min-h-screen pt-6">
                <div className="lg:col-span-3 xl:col-span-2 hidden lg:flex flex-col">
                    <Card className="sticky top-20 mb-8 w-full gap-0 shadow-lg border-slate-200 dark:border-slate-800">
                        <CardHeader className="text-lg font-bold">
                            Filters
                        </CardHeader>
                        <Separator />
                        <CardContent className="p-4 sm:p-6">
                            <Accordion
                                type="single"
                                collapsible
                                className="w-full space-y-2"
                            >
                                <AccordionItem
                                    value={`Condition`}
                                    className="border-b border-slate-200"
                                >
                                    <AccordionTrigger className="py-4 text-left text-sm font-semibold text-slate-900 hover:no-underline md:text-lg">
                                        Condition
                                    </AccordionTrigger>
                                    <AccordionContent className="flex flex-col gap-2 text-xl leading-relaxed text-slate-600">
                                        <div className="flex items-center gap-3">
                                            <Checkbox id="condition-ecofriendly" />
                                            <Label
                                                htmlFor="condition-ecofriendly"
                                                className="text-sm font-medium cursor-pointer"
                                            >
                                                Ecofriendly
                                            </Label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Checkbox id="condition-excellent" />
                                            <Label
                                                htmlFor="condition-excellent"
                                                className="text-sm font-medium cursor-pointer"
                                            >
                                                Excellent
                                            </Label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Checkbox id="condition-good" />
                                            <Label
                                                htmlFor="condition-good"
                                                className="text-sm font-medium cursor-pointer"
                                            >
                                                Good
                                            </Label>
                                        </div>
                                    </AccordionContent>
                                    <Separator />
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>
                <main className="lg:col-span-9 xl:col-span-10 flex flex-1 flex-col min-w-0">
                    {children}
                </main>
            </div>
            <Subscribe />
            <Footer />
        </>
    );
}

export default CollectionLayout;
