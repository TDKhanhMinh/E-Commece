"use client";

import { useEffect, useState } from "react";
import { Bell, Check, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { useTranslations } from "next-intl";
import { useNotificationsQuery, useMarkAllAsReadMutation } from "@/hooks/use-push-notifications";

interface NotificationResponse {
    id: number | string;
    title: string;
    body?: string;
    message?: string;
    isRead?: boolean;
    read?: boolean;
    createdAt?: string;
    createdDate?: string;
}

export function NotificationContent({ onActionComplete }: { onActionComplete?: () => void }) {
    const t = useTranslations("common");
    const { data: notifications = [], isLoading, refetch } = useNotificationsQuery(0, 20);
    const markAllAsReadMutation = useMarkAllAsReadMutation();

    const unreadCount = notifications.filter((n: NotificationResponse) => n.isRead === false || n.read === false).length;

    const markAllAsRead = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        markAllAsReadMutation.mutate(undefined, {
            onSuccess: () => {
                toast.success("Đã đánh dấu tất cả là đã đọc");
                refetch();
            },
            onError: () => {
                toast.error("Có lỗi xảy ra");
            }
        });
    };

    return (
        <div className="flex flex-col w-full">
            <div className="flex items-center justify-between p-4 pb-2 border-b md:border-none">
                <h4 className="text-sm font-semibold">Thông báo</h4>
                {unreadCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="h-auto p-0 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                        <Check className="mr-1 h-3 w-3" />
                        Đánh dấu đã đọc
                    </Button>
                )}
            </div>
            <SimpleBar style={{ maxHeight: 400 }} className="w-full p-2">
                {notifications.length === 0 && !isLoading ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <BellRing className="mb-3 h-10 w-10 text-muted-foreground/40" />
                        <p className="text-sm font-medium text-muted-foreground">
                            Bạn chưa có thông báo nào
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1">
                        {notifications.map((notification: any, index: number) => {
                            const isUnread =
                                notification.isRead === false ||
                                notification.read === false;
                            return (
                                <DropdownMenuItem
                                    key={notification.id || `notification-${index}`}
                                    className={`flex flex-col items-start gap-1 rounded-lg p-3 transition-colors ${
                                        isUnread
                                            ? "bg-muted/50 font-medium"
                                            : "text-muted-foreground"
                                    }`}
                                >
                                    <div className="flex w-full items-start justify-between gap-2">
                                        <span className="text-sm leading-snug">
                                            {notification.title}
                                        </span>
                                        {isUnread && (
                                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                                        )}
                                    </div>
                                    <span className="line-clamp-2 text-xs leading-relaxed opacity-80">
                                        {notification.body ||
                                            notification.message}
                                    </span>
                                </DropdownMenuItem>
                            );
                        })}
                    </div>
                )}
            </SimpleBar>
            {onActionComplete && (
                 <div className="border-t p-2 text-center md:hidden">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 w-full text-xs font-medium"
                        onClick={onActionComplete}
                    >
                        Đóng
                    </Button>
                </div>
            )}
        </div>
    );
}

export function NotificationDropdown() {
    const t = useTranslations("common");
    const [isOpen, setIsOpen] = useState(false);
    
    // We only need unreadCount for the trigger badge
    const { data: notifications = [] } = useNotificationsQuery(0, 20);
    const unreadCount = notifications.filter((n: NotificationResponse) => n.isRead === false || n.read === false).length;

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="bg-destructive text-destructive-foreground absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full text-[10px]">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[calc(100vw-32px)] sm:w-80 p-0 overflow-hidden">
                <NotificationContent onActionComplete={() => setIsOpen(false)} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
