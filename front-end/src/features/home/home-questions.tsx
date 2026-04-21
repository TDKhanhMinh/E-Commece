"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";

export function HomeQuestions() {
    const t = useTranslations("home.faq");
    const faqKeys = ["0", "1", "2", "3", "4"] as const;

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12 lg:py-16 font-sans">
            <div className="mx-auto mb-8 max-w-5xl text-center sm:mb-12">
                <span className="mb-4 block bg-gradient-to-r from-orange-500 via-indigo-500 to-green-500 bg-clip-text text-lg font-bold tracking-tighter text-transparent uppercase sm:text-xl">
                    {t("badge")}
                </span>
                <h2 className="my-1 text-2xl font-bold uppercase text-slate-900 sm:text-3xl md:text-4xl dark:text-slate-100">
                    {t("title")}
                </h2>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-2">
                {faqKeys.map((key) => (
                    <AccordionItem
                        key={key}
                        value={`item-${key}`}
                        className="border-b border-slate-200 dark:border-slate-800"
                    >
                        <AccordionTrigger className="text-secondary-dark py-4 text-left text-sm font-semibold hover:no-underline sm:py-6 sm:text-base md:text-lg dark:text-slate-200">
                            {t(`items.${key}.question`)}
                        </AccordionTrigger>
                        <AccordionContent className="text-secondary-dark pb-4 text-sm leading-relaxed sm:pb-6 sm:text-base dark:text-slate-400">
                            {t(`items.${key}.answer`)}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>

    );
}

