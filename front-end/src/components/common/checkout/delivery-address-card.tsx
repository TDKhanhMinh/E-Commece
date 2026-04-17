"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Plus, User, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DeliveryAddress } from "@/type/user-type";
import { useTranslations } from "next-intl";

interface DeliveryAddressCardProps {
    hasAddresses: boolean;
    defaultAddress?: DeliveryAddress | null;
    onAddAddress: () => void;
    onChangeAddress: () => void;
}

export function DeliveryAddressCard({
    hasAddresses,
    defaultAddress,
    onAddAddress,
    onChangeAddress,
}: DeliveryAddressCardProps) {
    const t = useTranslations("checkout.address");

    return (
        <Card className="dark:bg-slate-900/40 overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200/60 dark:ring-slate-800/50">
            <CardHeader className="dark:bg-slate-800/30 flex flex-row items-center justify-between border-b border-slate-50 bg-slate-50/50 px-6 py-4 dark:border-slate-800/50">
                <CardTitle className="dark:text-slate-100 flex items-center gap-2 text-lg font-bold text-slate-800">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    {t("title")}
                </CardTitle>
                {hasAddresses && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onChangeAddress}
                        className="dark:text-blue-400 dark:hover:bg-blue-900/30 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                    >
                        {t("change")}
                    </Button>
                )}
            </CardHeader>
            <CardContent className="p-6">
                {!hasAddresses ? (
                    <div className="flex flex-col items-center justify-center space-y-4 py-8">
                        <div className="dark:bg-slate-800 rounded-full bg-slate-100 p-4">
                            <MapPin className="h-8 w-8 text-slate-400" />
                        </div>
                        <div className="text-center">
                            <p className="dark:text-slate-100 font-semibold text-slate-900">
                                {t("empty")}
                            </p>
                            <p className="dark:text-slate-400 text-sm text-slate-500">
                                {t("emptyHint")}
                            </p>
                        </div>
                        <Button onClick={onAddAddress} className="gap-2">
                            <Plus className="h-4 w-4" />
                            {t("add")}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="dark:text-slate-100 flex items-center gap-2 font-bold text-slate-900">
                                        <User className="h-4 w-4 text-slate-400" />
                                        {defaultAddress?.userName}
                                    </div>
                                    {defaultAddress?.isDefault && (
                                        <Badge
                                            variant="secondary"
                                            className="dark:bg-blue-900/30 dark:text-blue-400 bg-blue-50 text-[10px] font-bold text-blue-600"
                                        >
                                            {t("default")}
                                        </Badge>
                                    )}
                                </div>

                                <div className="dark:text-slate-400 flex items-center gap-2 text-sm text-slate-600">
                                    <Phone className="h-4 w-4 text-slate-400" />
                                    {defaultAddress?.phoneNumber}
                                </div>

                                <div className="dark:text-slate-400 flex items-start gap-2 text-sm text-slate-600">
                                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                                    <p className="leading-relaxed">
                                        {defaultAddress?.location}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
