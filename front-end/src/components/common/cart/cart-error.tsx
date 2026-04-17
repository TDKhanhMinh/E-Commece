import { Card } from "@/components/ui/card";
import { BackButton } from "@/components/common/ui/back-button";
import { useTranslations } from "next-intl";

export function CartError() {
    const t = useTranslations("cart.error");

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8">
            <div className="mb-6">
                <BackButton />
            </div>
            <Card className="dark:bg-slate-900 dark:border-slate-800 p-8 text-center">
                <p className="text-destructive dark:text-red-400 text-lg font-medium">
                    {t("message")}
                </p>
            </Card>
        </div>
    );
}

