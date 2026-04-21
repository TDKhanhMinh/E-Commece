"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { DeliveryAddress, getDeliveryAddresses } from "@/service/user-service";
import { AddressCard, AddressDialog } from "@/components/common";
import { BackButton } from "@/components/common/ui/back-button";
import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";

export default function AddressDelivery() {
    const t = useTranslations("user.addresses");

    const {
        data: addressList,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["addresses"],
        queryFn: getDeliveryAddresses,
    });

    const addresses = (addressList as unknown as any) || [];
    console.log("Address List:", addresses);
    if (isLoading) {
        return (
            <div className="mx-auto w-full max-w-6xl p-4">
                <BackButton />
                <div className="text-muted-foreground py-10 text-center">
                    {t("loading")}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="mx-auto w-full max-w-6xl p-4">
                <BackButton />
                <div className="text-destructive py-10 text-center">
                    {t("error")}
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-5xl space-y-4 px-4 py-6 sm:py-8">
            <div className="flex items-center">
                <BackButton />
            </div>

            <Card className="w-full border-none shadow-sm dark:bg-slate-900/40 backdrop-blur-sm border border-slate-100 dark:border-slate-800 overflow-hidden rounded-2xl">
                <CardContent className="p-4 sm:p-8">
                    <div className="mb-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                        <div className="space-y-1">
                            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                                {t.rich("title", {
                                    count: addresses?.length || 0,
                                    blue: (chunks) => (
                                        <span className="text-blue-600 dark:text-blue-500">
                                            {chunks}
                                        </span>
                                    ),
                                })}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium">
                                Quản lý danh sách địa chỉ nhận hàng của bạn
                            </p>
                        </div>
                        <div className="w-full sm:w-auto">
                            <AddressDialog
                                btnText={t("addBtn")}
                                title={t("addTitle")}
                                type="add"
                                addressId={0}
                            />
                        </div>
                    </div>

                    {addresses?.length === 0 ? (
                        <div className="text-muted-foreground py-20 text-center flex flex-col items-center gap-4">
                            <MapPin className="size-12 opacity-20" />
                            <p className="font-medium">{t("empty")}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                            {addresses?.map((item: DeliveryAddress) => (
                                <AddressCard
                                    key={item.id}
                                    id={item.id}
                                    name={item.userName}
                                    address={item.location}
                                    phone={item.phoneNumber}
                                    isDefault={item.isDefault}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
