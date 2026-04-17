"use client";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import ConfirmAction from "../dialog/confirm-action";
import { deleteDeliveryAddress } from "@/service/user-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AddressDialog } from "@/components/common";
import { AddressCardProps } from "@/type/user-type";

import { useTranslations } from "next-intl";

export function AddressCard({
    id,
    name,
    address,
    phone,
    isDefault,
}: AddressCardProps) {
    const queryClient = useQueryClient();
    const t = useTranslations("common.user.address");

    const deleteMutation = useMutation({
        mutationFn: (addressId: number) => deleteDeliveryAddress(addressId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
            toast.success(t("deleteSuccess"));
        },
        onError: () => {
            toast.error(t("deleteError"));
        },
    });

    const handlerDeleteAddress = () => {
        deleteMutation.mutate(id);
    };

    return (
        <Card className="border-secondary relative gap-0 space-y-3 rounded-xl border-2 p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
                {isDefault ? (
                    <Badge className="flex cursor-pointer gap-1 rounded-lg border-0 px-3 py-1 font-medium text-white hover:bg-blue-200">
                        <MapPin className="size-3" /> {t("default")}
                    </Badge>
                ) : (
                    <div className="h-7" />
                )}

                <div className="flex items-center gap-2 text-sm font-medium">
                    <AddressDialog
                        btnText={t("edit")}
                        title={t("editTitle")}
                        type={"edit"}
                        addressId={id}
                        phoneNumber={phone}
                        userName={name}
                        location={address}
                    />

                    <ConfirmAction
                        title={t("deleteConfirm")}
                        description={t("deleteConfirmDesc")}
                        btnText={t("deleteBtn")}
                        requiredText="Delete"
                        actionText={
                            deleteMutation.isPending
                                ? t("deleting")
                                : t("deleteNow")
                        }
                        onConfirm={handlerDeleteAddress}
                        isPending={deleteMutation.isPending}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <h4 className="text-secondary-dark text-lg font-bold">
                    {name}
                </h4>
                <div className="text-secondary-dark space-y-1 text-sm">
                    <p>
                        <span className="mr-2 font-semibold">{t("label")}</span>
                        {address}
                    </p>
                    <p>
                        <span className="mr-2 font-semibold">
                            {t("phoneLabel")}
                        </span>
                        {phone}
                    </p>
                </div>
            </div>
        </Card>
    );
}
