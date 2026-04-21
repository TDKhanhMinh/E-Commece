"use client";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationControlProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function PaginationControl({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationControlProps) {
    if (totalPages <= 1) return null;

    const generatePaginationItems = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);

            if (currentPage > 3) pages.push("ellipsis-start");

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) pages.push("ellipsis-end");

            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <Pagination>
            <PaginationContent className="gap-0.5 sm:gap-1">
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) onPageChange(currentPage - 1);
                        }}
                        className={
                            currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                        }
                    />
                </PaginationItem>

                {generatePaginationItems().map((page, index) => {
                    if (typeof page === "string") {
                        return (
                            <PaginationItem key={index} className="hidden sm:inline-block">
                                <PaginationEllipsis />
                            </PaginationItem>
                        );
                    }

                    // Hide outer pages on extreme mobile if they aren't the current or direct neighbor
                    const isFar = Math.abs((page as number) - currentPage) > 1;
                    const isFirstOrLast = page === 1 || page === totalPages;

                    return (
                        <PaginationItem 
                            key={index}
                            className={isFar && !isFirstOrLast ? "hidden md:inline-block" : ""}
                        >
                            <PaginationLink
                                href="#"
                                isActive={page === currentPage}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(page as number);
                                }}
                                className="h-9 w-9 sm:h-10 sm:w-10"
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}

                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages)
                                onPageChange(currentPage + 1);
                        }}
                        className={
                            currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
