import { Badge } from "@/components/ui/badge";

export const getStatusBadge = (status: string | undefined) => {
    switch (status) {
        case "PENDING":
            return (
                <Badge
                    variant={"outline"}
                    className="border-yellow-600 bg-yellow-50 text-yellow-600 dark:border-yellow-900/50 dark:bg-yellow-950/20 dark:text-yellow-400"
                >
                    Chờ xác nhận
                </Badge>
            );
        case "CONFIRMED":
            return (
                <Badge
                    variant={"outline"}
                    className="border-sky-600 bg-sky-50 text-sky-600 dark:border-sky-900/50 dark:bg-sky-950/20 dark:text-sky-400"
                >
                    Đã xác nhận
                </Badge>
            );
        case "PAID":
            return (
                <Badge
                    variant={"outline"}
                    className="border-blue-600 bg-blue-50 text-blue-600 dark:border-blue-900/50 dark:bg-blue-950/20 dark:text-blue-400"
                >
                    Đã thanh toán
                </Badge>
            );
        case "UNPAID":
            return (
                <Badge
                    variant={"outline"}
                    className="border-red-600 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400"
                >
                    Chưa thanh toán
                </Badge>
            );
        case "SHIPPING":
            return (
                <Badge
                    variant={"outline"}
                    className="border-purple-600 bg-purple-50 text-purple-600 dark:border-purple-900/50 dark:bg-purple-950/20 dark:text-purple-400"
                >
                    Đang giao hàng
                </Badge>
            );
        case "DELIVERED":
            return (
                <Badge
                    variant={"outline"}
                    className="border-green-600 bg-green-50 text-green-600 dark:border-green-900/50 dark:bg-green-950/20 dark:text-green-400"
                >
                    Giao thành công
                </Badge>
            );
        case "CANCELLED":
            return (
                <Badge
                    variant={"outline"}
                    className="border-red-600 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400"
                >
                    Đã hủy
                </Badge>
            );
        case "FAILED":
            return (
                <Badge
                    variant={"outline"}
                    className="border-slate-600 bg-slate-100 text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400"
                >
                    Thất bại
                </Badge>
            );
        default:
            return (
                <Badge
                    variant={"outline"}
                    className="border-slate-300 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400"
                >
                    Không rõ
                </Badge>
            );
    }
};
