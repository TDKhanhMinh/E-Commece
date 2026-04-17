import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { MOCK_FAQ } from "../../../mock";


export function HomeQuestions() {
    return (
        <div className="mx-auto max-w-4xl px-4 py-16 font-sans">
            <div className="mx-auto mb-12 max-w-5xl text-center">
                <span className="mb-12 bg-linear-to-r from-orange-500 via-indigo-500 to-green-500 bg-clip-text text-xl font-bold tracking-tighter text-transparent uppercase">
                    EVERYTHING YOU NEED TO KNOW
                </span>
                <h2 className="my-1 font-bold uppercase text-slate-900 md:text-4xl dark:text-slate-100">
                    Frequently Asked Questions
                </h2>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-2">
                {MOCK_FAQ.map((item, index) => (
                    <AccordionItem
                        key={index}
                        value={`item-${index}`}
                        className="border-b border-slate-200 dark:border-slate-800"
                    >
                        <AccordionTrigger className="text-secondary-dark py-6 text-left text-sm font-semibold hover:no-underline md:text-lg dark:text-slate-200">
                            {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-secondary-dark pb-6 text-sm leading-relaxed md:text-base dark:text-slate-400">
                            {item.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
