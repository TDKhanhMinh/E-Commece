import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home, MoveLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      
      <div className="relative mb-8">
        <div className="absolute inset-0 blur-3xl opacity-20 bg-primary animate-pulse"></div>
        <FileQuestion className="relative w-24 h-24 text-primary mx-auto" />
      </div>

      
      <h1 className="text-9xl font-extrabold tracking-tighter text-primary">
        404
      </h1>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
        Không tìm thấy trang
      </h2>
      <p className="mt-4 text-muted-foreground max-w-125">
        Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm. Có vẻ như đường dẫn này đã bị xóa hoặc chưa từng tồn tại.
      </p>

      
      <div className="flex flex-col sm:flex-row gap-4 mt-10">
        <Button asChild variant="outline" size="lg" className="gap-2">
          <Link href="javascript:history.back()">
            <MoveLeft className="w-4 h-4" />
            Quay lại
          </Link>
        </Button>
        
        <Button asChild size="lg" className="gap-2">
          <Link href="/">
            <Home className="w-4 h-4" />
            Về trang chủ
          </Link>
        </Button>
      </div>

      
      <p className="mt-20 text-sm text-muted-foreground">
        Mã lỗi: <span className="font-mono text-primary">ERR_PAGE_NOT_FOUND</span>
      </p>
    </div>
  );
}