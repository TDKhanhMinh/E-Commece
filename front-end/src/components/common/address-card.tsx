"use client";
import { MapPin } from "lucide-react"; // Thêm icon Loader2
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import ConfirmAction from "@/components/common/confirm-action";
import { deleteDeliveryAddress } from "@/service/user-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import AddressDialog from "@/components/common/address-dialog";

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
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: (addressId: number) => deleteDeliveryAddress(addressId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
            toast.success("Đã xóa địa chỉ thành công");
        },
        onError: () => {
            toast.error("Xóa thất bại, vui lòng thử lại");
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
                        <MapPin className="size-3" /> Địa chỉ mặc định
                    </Badge>
                ) : (
                    <div className="h-7" />
                )}

                <div className="flex items-center gap-2 text-sm font-medium">
                    <AddressDialog
                        btnText={"Chỉnh sửa"}
                        title={"Chỉnh sửa địa chỉ"}
                        type={"edit"}
                        addressId={id}
                        phoneNumber={phone}
                        userName={name}
                        location={address}
                    />

                    <ConfirmAction
                        title="Xóa địa chỉ?"
                        description="Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa không?"
                        btnText="Xóa"
                        requiredText="Delete"
                        actionText={
                            deleteMutation.isPending
                                ? "Đang xóa..."
                                : "Xóa ngay"
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
                        <span className="mr-2 font-semibold">Địa chỉ:</span>
                        {address}
                    </p>
                    <p>
                        <span className="mr-2 font-semibold">Điện thoại:</span>
                        {phone}
                    </p>
                </div>
            </div>
        </Card>
    );
}

export default AddressCard;
