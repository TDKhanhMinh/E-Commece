import { useRouter } from "next/navigation";

interface UserOrderItemProps {
    id: string;
    title: string;
    price: string;
    image: string;
}
function UserOrderItem({ id, title, price, image }: UserOrderItemProps) {
    const router = useRouter();
    return (
        <>
            <div
                onClick={() => router.push(`/user/orders/${id}`)}
                className="group flex cursor-pointer flex-col items-start gap-4 border-b py-6 transition-colors last:border-none hover:bg-gray-50/50 md:flex-row md:items-center"
            >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-white">
                    <img
                        src={image}
                        alt="Product"
                        className="h-full w-full object-contain p-1"
                    />
                </div>

                <div className="min-w-0 flex-1 pr-4">
                    <h3 className="line-clamp-2 text-sm font-medium text-green-800 md:line-clamp-1">
                        {title}
                    </h3>
                </div>

                <div className="flex min-w-70 flex-col items-start gap-1 text-sm md:items-end">
                    <div className="flex gap-1">
                        <span className="font-bold text-gray-900">
                            Thanh toán:
                        </span>
                        <span className="text-gray-900">{price}</span>
                    </div>
                    <div className="flex gap-1 text-gray-600">
                        <span className="font-bold text-gray-900">
                            Mã đơn hàng:
                        </span>
                        <span>#{id}</span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserOrderItem;
