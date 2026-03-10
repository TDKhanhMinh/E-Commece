"use client";
import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search, Star, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDeleteReview, useReviewsAdmin } from "@/hooks/use-review";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminReviewPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);
    const pageSize = 10;

    const { data, isLoading, isError } = useReviewsAdmin({
        search: searchTerm,
        page: page,
        size: pageSize,
    });

    const deleteMutation = useDeleteReview();

    const reviews = data?.content || [];
    console.log("AdminReviewPage data:", data?.content);
    const totalPages = data?.totalPages || 0;

    const handleDelete = (id: number) => {
        deleteMutation.mutate(id);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    if (isLoading)
        return (
            <div className="p-10 text-center text-gray-500">Đang tải...</div>
        );
    if (isError)
        return (
            <div className="p-10 text-center text-red-500">Có lỗi xảy ra.</div>
        );

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Quản lý Đánh giá</h1>
                <div className="relative w-64">
                    <Search className="absolute top-2.5 left-2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Tìm theo sản phẩm..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(0);
                        }}
                    />
                </div>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>{/* Table Header giữ nguyên */}</TableHeader>
                    <TableBody>
                        {reviews.length > 0 ? (
                            reviews.map((review: any) => (
                                <TableRow
                                    key={review.id}
                                    className="transition-colors hover:bg-gray-50"
                                >
                                    {/* Cột Khách hàng: Hiển thị Avatar và Tên */}
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={review.reviewerImage}
                                                alt={review.reviewerName}
                                                className="h-10 w-10 rounded-full border object-cover"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm leading-none font-semibold">
                                                    {review.reviewerName}
                                                </span>
                                                {review.isVerified && (
                                                    <span className="mt-1 text-[10px] font-medium text-green-600">
                                                        ✓ Đã mua hàng
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Cột Sản phẩm */}
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">
                                                {review.productName}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                Slug: {review.productSlug}
                                            </span>
                                        </div>
                                    </TableCell>

                                    {/* Cột Đánh giá (Sao) */}
                                    <TableCell>
                                        <div className="flex items-center text-yellow-500">
                                            <span className="mr-1 font-bold">
                                                {review.rating}
                                            </span>
                                            <Star className="h-4 w-4 fill-current" />
                                        </div>
                                    </TableCell>

                                    {/* Cột Nội dung: Tiêu đề và Bình luận */}
                                    <TableCell className="max-w-75">
                                        <div className="flex flex-col">
                                            <span className="truncate text-sm font-semibold">
                                                {review.title}
                                            </span>
                                            <p className="mt-1 line-clamp-2 text-xs text-gray-500 italic">
                                                "{review.content}"
                                            </p>
                                        </div>
                                    </TableCell>

                                    {/* Cột Ngày tạo */}
                                    <TableCell className="text-xs text-gray-500">
                                        {new Date(
                                            review.reviewDate
                                        ).toLocaleString("vi-VN", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </TableCell>

                                    {/* Cột Thao tác */}
                                    <TableCell className="text-right">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:bg-red-50 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Xác nhận xóa?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Bạn có chắc chắn muốn
                                                        xóa đánh giá của{" "}
                                                        <b>
                                                            {
                                                                review.reviewerName
                                                            }
                                                        </b>{" "}
                                                        cho sản phẩm{" "}
                                                        <b>
                                                            {review.productName}
                                                        </b>
                                                        ?
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Hủy
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            handleDelete(
                                                                review.id
                                                            )
                                                        }
                                                        className="bg-red-500 hover:bg-red-600"
                                                        disabled={
                                                            deleteMutation.isPending
                                                        }
                                                    >
                                                        {deleteMutation.isPending
                                                            ? "Đang xóa..."
                                                            : "Xác nhận xóa"}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="h-24 text-center text-gray-500"
                                >
                                    Không có dữ liệu đánh giá nào.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <div className="flex items-center justify-between border-t px-4 py-4">
                    <div className="text-sm text-gray-500">
                        Hiển thị {reviews.length} trên tổng số{" "}
                        {data?.totalElements || 0} đánh giá
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 0}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Trước
                        </Button>

                        <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">
                                Trang {page + 1}
                            </span>
                            <span className="text-sm text-gray-500">
                                / {totalPages}
                            </span>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page >= totalPages - 1}
                        >
                            Tiếp
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReviewPage;
