"use client";

import React from "react";
import { Trash2, UserCircle, Loader2 } from "lucide-react";
import { ChatRoomResponse } from "@/type/chat-type";
import { ConfirmDialog } from "@/components/common/dialog/confirm-dialog";

interface ChatRoomItemProps {
    room: ChatRoomResponse;
    adminId: string;
    isSelected: boolean;
    isDeleting: boolean;
    onSelect: (
        customerId: string | number,
        name: string,
        roomId: string | number
    ) => void;
    onDelete: (roomId: string | number) => void;
}

import { useTranslations } from "next-intl";

export const ChatRoomItem: React.FC<ChatRoomItemProps> = ({
    room,
    adminId,
    isSelected,
    isDeleting,
    onSelect,
    onDelete,
}) => {
    const t = useTranslations("chat");
    const customerId = String(
        String(room.participantOne) === String(adminId)
            ? room.participantTwo
            : room.participantOne
    );

    return (
        <div
            onClick={() =>
                onSelect(
                    customerId,
                    room.userName || `User ID: ${customerId}`,
                    room.id
                )
            }
            className={`group flex cursor-pointer items-center gap-3 border-b border-gray-100 dark:border-slate-800 p-4 transition-all hover:bg-gray-100 dark:hover:bg-slate-800 ${
                isSelected ? "border-l-4 border-l-blue-600 bg-blue-50 dark:bg-blue-950/30" : ""
            }`}
        >
            <div className="relative">
                <UserCircle size={40} className="text-gray-400 dark:text-slate-500" />
            </div>
            <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                    <h4 className="truncate text-sm font-semibold text-gray-800 dark:text-slate-200">
                        {room.userName || `User ID: ${customerId}`}
                    </h4>
                    <span className="text-[10px] whitespace-nowrap text-gray-400 dark:text-slate-500">
                        {room.lastMessageTime
                            ? new Date(room.lastMessageTime).toLocaleTimeString(
                                  [],
                                  {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                  }
                              )
                            : ""}
                    </span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                    <p className="truncate text-xs text-gray-500 dark:text-slate-400">
                        {room.lastMessageContent || t("noMessages")}
                    </p>
                    <ConfirmDialog
                        trigger={
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                                disabled={isDeleting}
                                className="p-1 text-gray-400 dark:text-slate-500 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500 dark:hover:text-red-400 disabled:opacity-50"
                            >
                                {isDeleting ? (
                                    <Loader2 size={14} className="animate-spin" />
                                ) : (
                                    <Trash2 size={14} />
                                )}
                            </button>
                        }
                        title={t("deleteChat.title")}
                        description={t("deleteChat.description")}
                        confirmText={t("deleteChat.confirm")}
                        cancelText={t("deleteChat.cancel")}
                        destructive
                        onConfirm={() => onDelete(room.id)}
                    />
                </div>
            </div>
        </div>
    );
};
