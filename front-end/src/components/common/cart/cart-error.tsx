import { Card } from "@/components/ui/card";
import { BackButton } from "@/components/common/ui/back-button";

export function CartError() {
    return (
        <div className="container mx-auto max-w-6xl px-4 py-8">
            <div className="mb-6">
                <BackButton />
            </div>
            <Card className="p-8 text-center dark:bg-slate-900 dark:border-slate-800">
                <p className="text-destructive text-lg font-medium dark:text-red-400">
                    Không thể tải giỏ hàng. Vui lòng thử lại sau.
                </p>
            </Card>
        </div>
    );
}
