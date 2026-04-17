"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface DeliveryAddress {
    id: number;
    location: string;
    userName: string;
    phoneNumber: string;
    isDefault: boolean;
}

interface DeliveryAddressCardProps {
    hasAddresses: boolean;
    defaultAddress: DeliveryAddress | null;
    onAddAddress: () => void;
    onChangeAddress: () => void;
}

export function DeliveryAddressCard({
    hasAddresses,
    defaultAddress,
    onAddAddress,
    onChangeAddress,
}: DeliveryAddressCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-neutral-100">
                    <MapPin className="text-primary h-5 w-5" />
                    Địa chỉ giao hàng
                </CardTitle>
            </CardHeader>
            <CardContent>
                {!hasAddresses ? (
                    <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center dark:border-slate-800 dark:bg-slate-900/30">
                        <MapPin className="mx-auto mb-3 h-12 w-12 text-gray-400 dark:text-slate-600" />
                        <p className="mb-2 font-semibold text-gray-700 dark:text-slate-200">
                            Chưa có địa chỉ giao hàng
                        </p>
                        <p className="text-muted-foreground mb-4 text-sm dark:text-slate-400">
                            Vui lòng thêm địa chỉ giao hàng để tiếp tục đặt hàng
                        </p>
                        <Button onClick={onAddAddress} variant="outline">
                            Thêm địa chỉ giao hàng
                        </Button>
                    </div>
                ) : defaultAddress ? (
                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-slate-900/50">
                        <div className="mb-2 flex items-center justify-between">
                            <p className="font-semibold dark:text-slate-200">
                                {defaultAddress.userName}
                            </p>
                            {defaultAddress.isDefault && (
                                <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-medium dark:bg-primary/20">
                                    Mặc định
                                </span>
                            )}
                        </div>
                        <p className="text-muted-foreground text-sm dark:text-slate-400">
                            {defaultAddress.phoneNumber}
                        </p>
                        <p className="text-muted-foreground mt-2 text-sm dark:text-slate-400">
                            {defaultAddress.location}
                        </p>
                        <Button
                            variant="link"
                            className="mt-2 h-auto p-0 text-sm"
                            onClick={onChangeAddress}
                        >
                            Thay đổi địa chỉ
                        </Button>
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
}
