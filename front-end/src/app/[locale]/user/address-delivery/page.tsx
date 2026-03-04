"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { DeliveryAddress, getDeliveryAddresses } from "@/service/user-service";
import { AddressCard, AddressDialog } from "@/components/common";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AddressDelivery() {
    const router = useRouter();

    const {
        data: addressList,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["addresses"],
        queryFn: getDeliveryAddresses,
    });

    const addresses = addressList || [];

    const BackButton = () => (
        <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-primary mb-4 flex items-center gap-1 pl-0 transition-colors"
        >
            <ChevronLeft className="h-5 w-5" />
            Quay lại trang trước
        </Button>
    );

    if (isLoading) {
        return (
            <div className="mx-auto w-full max-w-6xl p-4">
                <BackButton />
                <div className="text-muted-foreground py-10 text-center">
                    Đang tải danh sách địa chỉ...
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="mx-auto w-full max-w-6xl p-4">
                <BackButton />
                <div className="text-destructive py-10 text-center">
                    Không thể tải danh sách địa chỉ. Vui lòng thử lại sau.
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
                            Bạn có{" "}
                            <span className="text-blue-600">
                                {addresses?.length}
                            </span>{" "}
                            địa chỉ
                        </h3>
                        <AddressDialog
                            btnText="Thêm địa chỉ"
                            title="Thêm địa chỉ"
                            type="add"
                            addressId={0}
                        />
                    </div>

                    {addresses?.length === 0 ? (
                        <div className="text-muted-foreground py-10 text-center">
                            Bạn chưa lưu địa chỉ nào.
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
