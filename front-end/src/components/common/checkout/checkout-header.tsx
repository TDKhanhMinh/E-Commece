"use client";
import { BackButton } from "@/components/common/ui/back-button";
import { Fragment } from "react";
import { useTranslations } from "next-intl";

export function CheckoutHeader() {
    const t = useTranslations("checkout.header");
    return (
        <Fragment>
            <BackButton />
            <div className="mb-4 sm:mb-8 flex items-center gap-4">
                <h1 className="dark:text-neutral-100 text-2xl sm:text-3xl font-bold">
                    {t("title")}
                </h1>
            </div>
        </Fragment>
    );
}

