import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home } from "lucide-react";
import { BackButton } from "@/components/common/ui/back-button";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center transition-colors duration-300">
            <div className="relative mb-8">
                <div className="bg-primary/20 dark:bg-primary/30 absolute inset-0 animate-pulse blur-3xl"></div>
                <FileQuestion className="text-primary relative mx-auto h-24 w-24" />
            </div>

            <h1 className="text-primary/90 dark:text-primary text-9xl font-extrabold tracking-tighter drop-shadow-sm">
                404
            </h1>
            <h2 className="text-foreground mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Không tìm thấy trang
            </h2>
            <p className="text-muted-foreground mt-4 max-w-125">
                Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
                Có vẻ như đường dẫn này đã bị xóa hoặc chưa từng tồn tại.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button asChild variant="outline" size="lg" className="border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 gap-2 transition-all active:scale-95">
                    <BackButton />
                </Button>

                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-primary dark:hover:bg-primary/80 gap-2 shadow-lg transition-all active:scale-95">
                    <Link href="/">
                        <Home className="h-4 w-4" />
                        Về trang chủ
                    </Link>
                </Button>
            </div>

            <p className="text-muted-foreground mt-20 text-sm">
                Mã lỗi:{" "}
                <span className="text-primary font-mono">
                    ERR_PAGE_NOT_FOUND
                </span>
            </p>
        </div>
    );
}