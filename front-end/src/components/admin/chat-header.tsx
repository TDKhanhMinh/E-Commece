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
        <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4">
            <div className="flex items-center gap-3">
                <UserCircle size={40} className="text-gray-400" />
                <div>
                    <h3 className="text-base font-bold text-gray-800">
                        {selectedUserName}
                    </h3>
                    <div className="flex items-center gap-1">
                        <span
                            className={`h-2 w-2 rounded-full ${
                                connectionError
                                    ? "bg-red-500"
                                    : isConnected
                                      ? "bg-green-500"
                                      : "bg-gray-300"
                            }`}
                        ></span>
                        <p
                            className={`text-xs ${
                                connectionError
                                    ? "text-red-500"
                                    : isConnected
                                      ? "text-green-500"
                                      : "text-gray-400"
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
            <div className="flex gap-2 text-gray-500">
                <button className="rounded-full p-2 hover:bg-gray-100 hover:text-blue-600">
                    <Phone size={20} />
                </button>
                <button className="rounded-full p-2 hover:bg-gray-100 hover:text-blue-600">
                    <Video size={20} />
                </button>
                <button className="rounded-full p-2 hover:bg-gray-100">
                    <MoreVertical size={20} />
                </button>
            </div>
        </div>
    );
};

