import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { BackButton } from "@/components/common/ui/back-button";
import { useTranslations } from "next-intl";

interface CartHeaderProps {
    itemCount: number;
    onClearCart: () => void;
    isClearingCart: boolean;
    hasItems: boolean;
}

export function CartHeader({
    itemCount,
    onClearCart,
    isClearingCart,
    hasItems,
}: CartHeaderProps) {
    const t = useTranslations("cart.header");

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <BackButton />
                {hasItems && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClearCart}
                        disabled={isClearingCart}
                        className="text-destructive hover:text-destructive"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {isClearingCart ? t("clearing") : t("clearAll")}
                    </Button>
                )}
            </div>

            <h1 className="dark:text-slate-100 mb-8 text-3xl font-bold">
                {t("title", { count: itemCount })}
            </h1>
        </>
    );
}

