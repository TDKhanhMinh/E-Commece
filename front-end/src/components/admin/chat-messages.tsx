"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { ChatMessage } from "@/type/chat-type";

interface ChatMessagesProps {
    messages: ChatMessage[];
    adminId: string;
    isLoading: boolean;
    scrollRef: React.RefObject<HTMLDivElement | null>;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
    messages,
    adminId,
    isLoading,
    scrollRef,
}) => {
    return (
        <div
            ref={scrollRef}
            className="scrollbar-thin flex-1 overflow-y-auto bg-slate-50 p-6"
        >
            {isLoading ? (
                <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
            ) : (
                <div className="space-y-6">
                    {messages.map((msg, idx) => {
                        const isAdmin =
                            String(msg.senderId) === String(adminId);
                        return (
                            <div
                                key={msg.id || idx}
                                className={`flex flex-col ${isAdmin ? "items-end" : "items-start"} gap-1`}
                            >
                                <div
                                    className={`max-w-[70%] px-5 py-3 text-[14.5px] shadow-sm ${
                                        isAdmin
                                            ? "rounded-2xl rounded-tr-none bg-blue-600 text-white"
                                            : "rounded-2xl rounded-tl-none border border-gray-200 bg-white text-gray-800"
                                    }`}
                                >
                                    {msg.content}
                                </div>
                                <span className="px-1 text-[10px] font-medium text-gray-400">
                                    {msg.timestamp
                                        ? new Date(
                                              msg.timestamp
                                          ).toLocaleTimeString([], {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                          })
                                        : "Vừa xong"}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

