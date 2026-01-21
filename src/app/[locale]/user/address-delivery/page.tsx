"use client";

import AddressCard from "@/components/common/address-card";
import AddressDialog from "@/components/common/address-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Plus } from "lucide-react"; // Import icon từ lucide-react

const addresses = [
    {
        id: 1,
        name: "Trần Đỗ Khánh Minh",
        address:
            "UBND xã Thanh Vĩnh Đông, Tỉnh Lộ 827A, Xã Thanh Vĩnh Đông, Huyện Châu Thành, Tỉnh Long An",
        phone: "0345738266",
        isDefault: true,
    },
    {
        id: 2,
        name: "Trần Đỗ Khánh Minh",
        address:
            "Công ty TNHH Hai thành viên Thái Minh Phát, 36 Đường Số 7, Phường Bình Hưng Hòa A, Quận Bình Tân, Thành phố Hồ Chí Minh",
        phone: "0345728356",
        isDefault: true,
    },
    {
        id: 3,
        name: "tran minh",
        address: "Nguyễn Huệ, Phường Lào Cai, Thành phố Lào Cai, Tỉnh Lào Cai",
        phone: "0345738250",
        isDefault: false,
    },
];

export default function AddressDelivery() {
    return (
        <div className="mx-auto max-w-7xl space-y-0 p-4">
            <Card className="w-full border-none bg-gray-50/30 shadow-sm">
                <CardContent className="p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-lg font-bold">
                            Bạn có <span className="">{addresses.length}</span>{" "}
                            địa chỉ
                        </h3>
                        <AddressDialog />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
                        {addresses.map((item) => (
                            <AddressCard
                                key={item.id}
                                id={item.id}
                                name={item.name}
                                address={item.address}
                                phone={item.phone}
                                isDefault={item.isDefault}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
