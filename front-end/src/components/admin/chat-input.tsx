"use client";

import React from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
    messageInput: string;
    onMessageChange: (value: string) => void;
    onSend: (e: React.FormEvent) => void;
    selectedUserName: string;
    isDisabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    messageInput,
    onMessageChange,
    onSend,
    selectedUserName,
    isDisabled = false,
}) => {
    return (
        <div className="border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
            <form
                onSubmit={onSend}
                className="flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 p-1 pl-4 focus-within:border-blue-500 focus-within:ring-1"
            >
                <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => onMessageChange(e.target.value)}
                    placeholder={`${selectedUserName}...`}
                    disabled={isDisabled}
                    className="flex-1 bg-transparent py-2 text-[14.5px] outline-none disabled:opacity-50 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-600"
                />
                <button
                    type="submit"
                    disabled={!messageInput.trim() || isDisabled}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

