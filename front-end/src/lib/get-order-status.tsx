import { Badge } from "@/components/ui/badge";

export const getStatusBadge = (status: string | undefined) => {
    switch (status) {
        case "PENDING":
            return (
                <Badge
                    variant={"outline"}
                    className="border-yellow-600 bg-yellow-50 text-yellow-600"
                >
                    Chờ xác nhận
                </Badge>
            );
        case "CONFIRMED":
            return (
                <Badge
                    variant={"outline"}
                    className="border-sky-600 bg-sky-50 text-sky-600"
                >
                    Đã xác nhận
                </Badge>
            );
        case "PAID":
            return (
                <Badge
                    variant={"outline"}
                    className="border-blue-600 bg-blue-50 text-blue-600"
                >
                    Đã thanh toán
                </Badge>
            );
        case "UNPAID":
            return (
                <Badge
                    variant={"outline"}
                    className="border-red-600 bg-red-50 text-red-600"
                >
                    Chưa thanh toán
                </Badge>
            );
        case "SHIPPING":
            return (
                <Badge
                    variant={"outline"}
                    className="border-purple-600 bg-purple-50 text-purple-600"
                >
                    Đang giao hàng
                </Badge>
            );
        case "DELIVERED":
            return (
                <Badge
                    variant={"outline"}
                    className="border-green-600 bg-green-50 text-green-600"
                >
                    Giao thành công
                </Badge>
            );
        case "CANCELLED":
            return (
                <Badge
                    variant={"outline"}
                    className="border-red-600 bg-red-50 text-red-600"
                >
                    Đã hủy
                </Badge>
            );
        case "FAILED":
            return (
                <Badge
                    variant={"outline"}
                    className="border-slate-600 bg-slate-100 text-slate-600"
                >
                    Thất bại
                </Badge>
            );
        default:
            return (
                <Badge
                    variant={"outline"}
                    className="border-slate-300 bg-slate-50 text-slate-500"
                >
                    Không rõ
                </Badge>
            );
    }
};
