"use client";

import React from "react";
import { MoreVertical, Phone, UserCircle, Video } from "lucide-react";

interface ChatHeaderProps {
    selectedUserName: string;
    isConnected: boolean;
    connectionError?: string | null;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
    selectedUserName,
    isConnected,
    connectionError,
}) => {
    return (
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
            <div className="flex items-center gap-3">
                <UserCircle size={40} className="text-gray-400 dark:text-slate-500" />
                <div>
                    <h3 className="text-base font-bold text-gray-800 dark:text-slate-100">
                        {selectedUserName}
                    </h3>
                    <div className="flex items-center gap-1">
                        <span
                            className={`h-2 w-2 rounded-full ${
                                connectionError
                                    ? "bg-red-500"
                                    : isConnected
                                      ? "bg-green-500"
                                      : "bg-gray-300 dark:bg-slate-700"
                            }`}
                        ></span>
                        <p
                            className={`text-xs ${
                                connectionError
                                    ? "text-red-500"
                                    : isConnected
                                      ? "text-green-500"
                                      : "text-gray-400 dark:text-slate-500"
                            }`}
                        >
                            {connectionError
                                ? "Lỗi kết nối"
                                : isConnected
                                  ? "Đang trực tuyến"
                                  : "Đang kết nối..."}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex gap-2 text-gray-500 dark:text-slate-400">
                <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400">
                    <Phone size={20} />
                </button>
                <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400">
                    <Video size={20} />
                </button>
                <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-slate-800">
                    <MoreVertical size={20} />
                </button>
            </div>
        </div>
    );
};

