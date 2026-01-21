"use client";
import Subscribe from "@/components/common/subscribe";
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

function CollectionLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <div className="col-span-12 flex h-32 flex-row items-center justify-center">
                <span className="text-6xl font-bold">Androids</span>
            </div>
            <div className="mb-8 grid min-h-screen grid-cols-12 px-8">
                <div className="col-span-2 flex flex-col">
                    <Card className="sticky top-20 mb-8 w-full gap-0 shadow-lg">
                        <CardHeader className="text-lg font-bold">
                            Filters
                        </CardHeader>
                        <Separator />
                        <CardContent>
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
                                                className="text-sm font-medium"
                                            >
                                                Ecofriendly
                                            </Label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Checkbox id="condition-excellent" />
                                            <Label
                                                htmlFor="condition-excellent"
                                                className="text-sm font-medium"
                                            >
                                                Excellent
                                            </Label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Checkbox id="condition-good" />
                                            <Label
                                                htmlFor="condition-good"
                                                className="text-sm font-medium"
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
                <main className="col-span-10 flex flex-1 flex-col">
                    {children}
                </main>
            </div>
            <Subscribe />
            <Footer />
        </>
    );
}

export default CollectionLayout;
