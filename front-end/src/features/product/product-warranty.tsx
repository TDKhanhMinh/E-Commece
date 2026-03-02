"use client";

import { Heart, ShieldCheck } from "lucide-react";

export function ProductWarranty() {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <div className="bg-primary rounded-full">
                    <ShieldCheck className="h-8 w-8 p-2 text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold">
                        Bảo hành 12 tháng
                    </span>
                    <span className="text-muted-foreground mt-1 text-xs">
                        Chúng tôi tự tin với chất lượng sản phẩm, bảo hành toàn
                        diện trong 12 tháng.
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="bg-primary rounded-full">
                    <Heart className="h-8 w-8 p-2 text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold">
                        Đổi trả trong 30 ngày
                    </span>
                    <span className="text-muted-foreground mt-1 text-xs">
                        Đổi trả miễn phí trong 30 ngày nếu sản phẩm có lỗi từ
                        nhà sản xuất.
                    </span>
                </div>
            </div>
        </div>
    );
}
