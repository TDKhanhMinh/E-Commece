import { MapPin } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

interface AddressCardProps {
    id: number;
    name: string;
    address: string;
    phone: string;
    isDefault: boolean;
}

function AddressCard({
    id,
    name,
    address,
    phone,
    isDefault,
}: AddressCardProps) {
    return (
        <>
            <Card
                key={id}
                className="border-secondary relative space-y-3 rounded-xl border-2 bg-white p-5"
            >
                <div className="flex items-start justify-between">
                    {isDefault ? (
                        <Badge className="bg-info-dark hover:bg-info flex cursor-pointer gap-1 rounded-lg px-3 py-1 font-medium">
                            <MapPin className="size-3" /> Địa chỉ mặc định
                        </Badge>
                    ) : (
                        <div className="h-7" />
                    )}

                    <div className="flex gap-4 text-sm font-medium">
                        <Button
                            variant={"ghost"}
                            className="cursor-pointer text-gray-500 hover:bg-transparent hover:text-red-500"
                        >
                            Xóa
                        </Button>
                        <Button
                            variant={"ghost"}
                            className="cursor-pointer text-green-800 hover:bg-transparent hover:underline"
                        >
                            Chỉnh sửa
                        </Button>
                    </div>
                </div>

                <div className="space-y-1">
                    <h4 className="font-bold text-gray-900">{name}</h4>
                    <p className="text-sm leading-relaxed text-gray-700">
                        <span className="border-b border-gray-400 font-bold">
                            Địa chỉ:
                        </span>{" "}
                        {address}
                    </p>
                    <p className="text-sm text-gray-700">
                        <span className="border-b border-gray-400 font-bold">
                            Số điện thoại:
                        </span>{" "}
                        {phone}
                    </p>
                </div>
            </Card>
        </>
    );
}

export default AddressCard;
