"use client";

import React from "react";
import { Loader2, Search } from "lucide-react";
import { ChatRoomResponse } from "@/type/chat-type";
import { ChatRoomItem } from "@/components/admin/chat/ChatRoomItem";

interface ChatRoomListProps {
    chatRooms: ChatRoomResponse[];
    isLoading: boolean;
    isDeleting: boolean;
    adminId: string;
    selectedUserId: string | null;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onSelectRoom: (customerId: string | number, name: string, roomId: string | number) => void;
    onDeleteRoom: (roomId: string | number) => void;
    onRefetch?: () => void;
}

export const ChatRoomList: React.FC<ChatRoomListProps> = ({
    chatRooms,
    isLoading,
    isDeleting,
    adminId,
    selectedUserId,
    searchQuery,
    onSearchChange,
    onSelectRoom,
    onDeleteRoom,
}) => {
    const filteredRooms = chatRooms.filter((room: ChatRoomResponse) => {
        const query = searchQuery.toLowerCase();
        const matchesChatId = room.chatId?.toLowerCase().includes(query);
        const matchesPart1 = String(room.participantOne)
            .toLowerCase()
            .includes(query);
        const matchesPart2 = String(room.participantTwo)
            .toLowerCase()
            .includes(query);
        return matchesChatId || matchesPart1 || matchesPart2;
    });

    return (
        <div className="flex w-87.5 flex-col border-r border-gray-200 bg-gray-50/50">
            <div className="border-b border-gray-200 p-4">
                <h2 className="text-lg font-bold text-gray-800">
                    Tin nhắn hỗ trợ
                </h2>
                <div className="relative mt-3">
                    <Search
                        className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Tìm kiếm người dùng..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-sm outline-none focus:border-blue-500"
                    />
                </div>
            </div>

            <div className="scrollbar-thin flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="flex justify-center p-10">
                        <Loader2 className="animate-spin text-blue-500" />
                    </div>
                ) : filteredRooms.length > 0 ? (
                    filteredRooms.map((room: ChatRoomResponse) => {
                        const customerId = String(
                            String(room.participantOne) === String(adminId)
                                ? room.participantTwo
                                : room.participantOne
                        );
                        return (
                            <ChatRoomItem
                                key={room.id}
                                room={room}
                                adminId={adminId}
                                isSelected={selectedUserId === customerId}
                                isDeleting={isDeleting}
                                onSelect={onSelectRoom as any}
                                onDelete={onDeleteRoom as any}
                            />
                        );
                    })
                ) : (
                    <div className="p-8 text-center text-sm text-gray-400">
                        Không tìm thấy hội thoại
                    </div>
                )}
            </div>
        </div>
    );
};
