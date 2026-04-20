"use client";

import { useEffect, useState } from "react";
import { Bell, Check, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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

export function NotificationDropdown() {
    const t = useTranslations("common");
    const [isOpen, setIsOpen] = useState(false);
    
    const { data: notifications = [], isLoading, refetch } = useNotificationsQuery(0, 20);
    const markAllAsReadMutation = useMarkAllAsReadMutation();

    const unreadCount = notifications.filter((n: NotificationResponse) => n.isRead === false || n.read === false).length;

    const markAllAsRead = () => {
        markAllAsReadMutation.mutate(undefined, {
            onSuccess: () => {
                toast.success("Đã đánh dấu tất cả là đã đọc");
            },
            onError: () => {
                toast.error("Có lỗi xảy ra");
            }
        });
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (open) refetch();
        }}>
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
            <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between p-4 pb-2">
                    <h4 className="text-sm font-semibold">Thông báo</h4>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-auto p-0 text-xs text-muted-foreground hover:text-primary">
                            <Check className="mr-1 h-3 w-3" />
                            Đánh dấu đã đọc
                        </Button>
                    )}
                </div>
                <SimpleBar style={{ maxHeight: 300 }} className="w-full p-2">
                    {notifications.length === 0 && !isLoading ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <BellRing className="mb-2 h-8 w-8 text-muted-foreground/50" />
                            <p className="text-sm text-muted-foreground">Bạn chưa có thông báo nào</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1">
                            {notifications.map((notification:any) => {
                                const isUnread = notification.isRead === false || notification.read === false;
                                return (
                                    <DropdownMenuItem key={notification.id} className={`flex flex-col items-start gap-1 p-3 ${isUnread ? "bg-muted/50 font-medium" : "text-muted-foreground"}`}>
                                        <div className="flex w-full items-start justify-between gap-2">
                                            <span className="text-sm">{notification.title}</span>
                                            {isUnread && <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />}
                                        </div>
                                        <span className="line-clamp-2 text-xs opacity-80">
                                            {notification.body || notification.message}
                                        </span>
                                    </DropdownMenuItem>
                                )
                            })}
                        </div>
                    )}
                </SimpleBar>
                <div className="p-2 border-t text-center">
                    <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => setIsOpen(false)}>
                        Đóng
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
