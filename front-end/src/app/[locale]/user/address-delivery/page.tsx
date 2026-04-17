"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { DeliveryAddress, getDeliveryAddresses } from "@/service/user-service";
import { AddressCard, AddressDialog } from "@/components/common";
import { BackButton } from "@/components/common/ui/back-button";
import { useTranslations } from "next-intl";

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
        <div className="mx-auto w-full max-w-6xl space-y-0 p-4">
            <BackButton />

            <Card className="w-full border-none shadow-sm">
                <CardContent className="p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-lg font-bold">
                            {t.rich("title", {
                                count: addresses?.length || 0,
                                blue: (chunks) => (
                                    <span className="text-blue-600">
                                        {chunks}
                                    </span>
                                ),
                            })}
                        </h3>
                        <AddressDialog
                            btnText={t("addBtn")}
                            title={t("addTitle")}
                            type="add"
                            addressId={0}
                        />
                    </div>

                    {addresses?.length === 0 ? (
                        <div className="text-muted-foreground py-10 text-center">
                            {t("empty")}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
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
