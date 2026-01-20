import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
    {
        question: "What condition are Plug devices in?",
        answer: "All Plug devices are Certified Pre-Owned and graded by condition—Excellent, Good, or Fair—so you always know what to expect. Every device is cleaned, tested, and fully functional, no matter the grade.",
    },
    {
        question: "Do Plug devices come with accessories?",
        answer: "Yes, most devices come with high-quality charging cables and necessary accessories. Please check the specific product description for details.",
    },
    {
        question: "What if I'm not happy with my order?",
        answer: "We offer a hassle-free return policy. If you're not satisfied, you can return your device within the specified timeframe for a refund or exchange.",
    },
    {
        question: "How fast will my order ship?",
        answer: "Orders are typically processed within 24 hours and shipped via standard or expedited methods depending on your choice at checkout.",
    },
    {
        question: "Are Plug devices original and authentic?",
        answer: "Absolutely. We guarantee that all devices sold are 100% authentic and have undergone rigorous multi-point inspections.",
    },
];

export function HomeQuestions() {
    return (
        <div className="mx-auto max-w-4xl px-4 py-16 font-sans">
            <div className="mx-auto mb-12 max-w-5xl text-center">
                <span className="mb-12 bg-gradient-to-r from-orange-500 via-indigo-500 to-green-500 bg-clip-text text-xl font-bold tracking-tighter text-transparent uppercase">
                    EVERYTHING YOU NEED TO KNOW
                </span>
                <h2 className="my-1 font-bold uppercase md:text-4xl">
                    Frequently Asked Questions
                </h2>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-2">
                {faqData.map((item, index) => (
                    <AccordionItem
                        key={index}
                        value={`item-${index}`}
                        className="border-b border-slate-200"
                    >
                        <AccordionTrigger className="py-6 text-left text-sm font-semibold text-slate-900 hover:no-underline md:text-lg">
                            {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 text-sm leading-relaxed text-slate-600">
                            {item.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
