import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { BackButton } from "@/components/common/ui/back-button";
import { useTranslations } from "next-intl";

interface CartEmptyProps {
    onContinueShopping: () => void;
}

export function CartEmpty({ onContinueShopping }: CartEmptyProps) {
    const t = useTranslations("cart.empty");

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8">
            <div className="mb-6">
                <BackButton />
            </div>
            <Card className="dark:bg-slate-900 dark:border-slate-800 p-12 text-center">
                <ShoppingCart className="text-muted-foreground dark:text-slate-500 mx-auto mb-4 h-16 w-16" />
                <h2 className="dark:text-slate-100 mb-2 text-2xl font-bold">
                    {t("title")}
                </h2>
                <p className="text-muted-foreground dark:text-slate-400 mb-6">
                    {t("description")}
                </p>
                <Button
                    onClick={onContinueShopping}
                    className="rounded-xl px-8 font-bold"
                >
                    {t("button")}
                </Button>
            </Card>
        </div>
    );
}

