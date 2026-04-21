"use client";
import { MapPin, User } from "lucide-react";
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
        <Card className="group relative flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm transition-all hover:shadow-lg hover:border-blue-200 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-blue-900 overflow-hidden">
            <div className="flex items-center justify-between">
                {isDefault ? (
                    <Badge className="bg-blue-600 hover:bg-blue-700 flex cursor-pointer gap-1.5 rounded-full border-0 px-3 py-1 text-[11px] font-bold text-white transition-all shadow-sm shadow-blue-200 dark:shadow-none">
                        <MapPin className="size-3" /> {t("default")}
                    </Badge>
                ) : (
                    <div className="h-6 sm:h-7" />
                )}

                <div className="flex items-center gap-1 sm:gap-2">
                    <div className="hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <AddressDialog
                            btnText={t("edit")}
                            title={t("editTitle")}
                            type={"edit"}
                            addressId={id}
                            phoneNumber={phone}
                            userName={name}
                            location={address}
                            isDefault={isDefault}
                        />
                    </div>

                    <div className="hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors group-hover:opacity-100 opacity-90 sm:opacity-70">
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
            </div>

            <div className="space-y-1.5 sm:space-y-2">
                <h4 className="text-slate-900 dark:text-slate-100 text-base sm:text-lg font-bold leading-tight flex items-center gap-2">
                    {name}
                </h4>
                <div className="text-slate-600 dark:text-slate-400 space-y-2 text-sm">
                    <div className="flex items-start gap-2.5">
                        <span className="shrink-0 mt-0.5 rounded-md bg-slate-100 dark:bg-slate-800 p-1">
                            <MapPin className="size-3.5 text-slate-500" />
                        </span>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">{t("label")}</span>
                            <span className="break-words font-medium text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">{address}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <span className="shrink-0 rounded-md bg-slate-100 dark:bg-slate-800 p-1">
                            <User className="size-3.5 text-slate-500" />
                        </span>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">{t("phoneLabel")}</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200 tracking-medium">{phone}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
