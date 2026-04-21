"use client";

import React, { memo, useEffect, useRef, useState } from "react";
import { Circle, Loader2, MessageCircle, Send, X } from "lucide-react";
import { useChat } from "@/hooks/use-chat";
import { useAuthStore } from "@/store/useAuthStore";
import { ChatMessage } from "@/type/chat-type";
import { useTranslations } from "next-intl";

const MessageList = memo(
    ({
        messages,
        currentUserId,
        isLoading,
    }: {
        messages: ChatMessage[];
        currentUserId: string;
        isLoading: boolean;
    }) => {
        const scrollRef = useRef<HTMLDivElement>(null);
        const t = useTranslations("chat.widget");

        useEffect(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollTo({
                    top: scrollRef.current.scrollHeight,
                    behavior: "smooth",
                });
            }
        }, [messages]);

        if (isLoading) {
            return (
                <div className="flex flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                </div>
            );
        }

        return (
            <div
                ref={scrollRef}
                className="scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-800 flex-1 overflow-y-auto bg-slate-50 p-5 dark:bg-slate-950"
            >
                {messages.length === 0 ? (
                    <div className="mt-10 text-center">
                        <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                            {t("welcome")}
                        </p>
                        <p className="text-[12px] text-gray-400 dark:text-slate-500">
                            {t("subtitle")}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((msg, index) => {
                            const isMyMessage =
                                String(msg.senderId) === String(currentUserId);

                            return (
                                <div
                                    key={msg.id || index}
                                    className={`flex flex-col ${isMyMessage ? "items-end" : "items-start"} gap-1`}
                                >
                                    <div
                                        className={`max-w-[85%] px-4 py-2.5 text-[14px] shadow-sm ${
                                            isMyMessage
                                                ? "rounded-2xl rounded-tr-none bg-blue-600 text-white"
                                                : "rounded-2xl rounded-tl-none border border-white bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                        }`}
                                    >
                                        {msg.content}
                                    </div>
                                    <span className="px-1 text-[10px] font-medium text-gray-400 uppercase dark:text-slate-500">
                                        {msg.timestamp
                                            ? new Date(
                                                  msg.timestamp
                                              ).toLocaleTimeString([], {
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                              })
                                            : t("justNow")}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }
);

MessageList.displayName = "MessageList";

const ChatWidget = () => {
    const user = useAuthStore((state) => state.user);
    const CURRENT_USER_ID = String(user?.id ?? "");
    const RECIPIENT_ID = "2";
    const t = useTranslations("chat.widget");

    const [isOpen, setIsOpen] = useState(false);
    const [messageInput, setMessageInput] = useState("");

    const { messages, isConnected, isLoading, sendMessage, connectionError } =
        useChat(CURRENT_USER_ID, RECIPIENT_ID);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim()) return;
        sendMessage(messageInput);
        setMessageInput("");
    };

    return (
        <div className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-50 flex flex-col items-end font-sans">
            {isOpen && (
                <div className="animate-in fade-in zoom-in-95 slide-in-from-bottom-10 mb-4 sm:mb-6 flex h-[min(500px,calc(100dvh-100px))] sm:h-125 w-[calc(100vw-32px)] sm:w-95 flex-col overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] duration-300 dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                    {/* 2. Header: Cố định ở trên cùng do flex-col */}
                    <div className="flex shrink-0 items-center justify-between bg-linear-to-r from-blue-600 to-indigo-600 p-4 text-white">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
                                    T7
                                </div>
                                <Circle
                                    size={10}
                                    className={`absolute -right-0.5 -bottom-0.5 rounded-full border-2 border-white fill-current ${isConnected ? "text-green-400" : "text-gray-400"}`}
                                />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold">
                                    {t("header")}
                                </h3>
                                <p className="text-[10px] opacity-80">
                                    {isConnected
                                        ? t("online")
                                        : t("connecting")}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="rounded-full p-2 transition-colors hover:bg-white/10"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* 3. Chat Body: flex-1 đảm bảo nó chiếm hết chỗ trống và đẩy input xuống dưới */}
                    {connectionError && (
                        <div className="border-b border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/20 dark:border-red-900 dark:text-red-400">
                            ⚠️ {connectionError}
                        </div>
                    )}
                    <MessageList
                        messages={messages}
                        currentUserId={CURRENT_USER_ID}
                        isLoading={isLoading}
                    />

                    {/* 4. Input Area: Cố định ở dưới cùng, shrink-0 ngăn không cho nó bị ép nhỏ */}
                    <div className="shrink-0 border-t bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                        <form
                            onSubmit={handleFormSubmit}
                            className="flex items-center gap-2"
                        >
                            <input
                                type="text"
                                value={messageInput}
                                onChange={(e) =>
                                    setMessageInput(e.target.value)
                                }
                                placeholder={t("inputPlaceholder")}
                                disabled={!isConnected || isLoading}
                                className="flex-1 rounded-2xl bg-gray-100 px-4 py-2.5 text-sm transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 disabled:opacity-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100 dark:focus:bg-slate-950"
                            />
                            <button
                                type="submit"
                                disabled={!isConnected || !messageInput.trim()}
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:shadow-none dark:shadow-none"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* FAB */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-xl transition-all duration-500 hover:scale-105 active:scale-95 ${
                    isOpen
                        ? "rotate-90 border border-gray-100 bg-white text-slate-600 shadow-none dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
                        : "bg-linear-to-tr from-blue-600 to-indigo-500 shadow-blue-200 dark:shadow-none"
                }`}
            >
                {isOpen ? (
                    <X size={28} className={"text-gray-700 dark:text-slate-300"} />
                ) : (
                    <MessageCircle
                        size={28}
                        fill="currentColor"
                        className="text-white"
                    />
                )}
            </button>
        </div>
    );
};

export default ChatWidget;
