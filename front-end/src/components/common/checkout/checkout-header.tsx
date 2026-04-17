"use client";
import { BackButton } from "@/components/common/ui/back-button";
import { Fragment } from "react";

export function CheckoutHeader() {
    return (
        <Fragment>
            <BackButton />
            <div className="mb-8 flex items-center gap-4">
                <h1 className="text-3xl font-bold dark:text-neutral-100">
                    Xác nhận đơn hàng
                </h1>
            </div>
        </Fragment>
    );
}
