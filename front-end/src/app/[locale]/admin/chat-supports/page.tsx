"use client";

import React, { useEffect, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useAdminChatRooms, useChat } from "@/hooks/use-chat";
import { useAuthStore } from "@/store/useAuthStore";
import { ChatRoomList } from "@/components/admin/chat-room-list";
import { ChatHeader } from "@/components/admin/chat-header";
import { ChatMessages } from "@/components/admin/chat-messages";
import { ChatInput } from "@/components/admin/chat-input";

const AdminChat = () => {
    const adminUser = useAuthStore((state) => state.user);
    const ADMIN_ID = String(adminUser?.id ?? "2");

    const { 
        chatRooms, 
        isLoadingRooms, 
        removeRoom, 
        isDeleting,
        fetchRooms 
    } = useAdminChatRooms();
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSelectRoom = (
        customerId: string | number,
        name: string,
        roomId: string | number
    ) => {
        setSelectedUser({
            id: customerId,
            name: name,
            roomId: roomId,
        });
    };

    return (
        <div className="flex h-[calc(100vh-100px)] w-full overflow-hidden rounded-2xl border border-gray-200 bg-white font-sans shadow-sm">
            <ChatRoomList
                chatRooms={chatRooms}
                isLoading={isLoadingRooms}
                isDeleting={isDeleting}
                adminId={ADMIN_ID}
                selectedUserId={selectedUser?.id || null}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSelectRoom={handleSelectRoom as any}
                onDeleteRoom={removeRoom as any}
                onRefetch={fetchRooms}
            />

            <div className="flex flex-1 flex-col bg-white">
                {selectedUser ? (
                    <ActiveChatWindow
                        adminId={ADMIN_ID}
                        selectedUser={selectedUser}
                    />
                ) : (
                    <div className="flex h-full flex-col items-center justify-center text-gray-400">
                        <MessageCircle
                            size={60}
                            className="mb-4 text-gray-200"
                        />
                        <p className="text-lg font-medium text-gray-500">
                            Chọn một cuộc trò chuyện để bắt đầu
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

const ActiveChatWindow = ({
    adminId,
    selectedUser,
}: {
    adminId: string;
    selectedUser: any;
}) => {
    const [messageInput, setMessageInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    const { messages, isConnected, isLoading, sendMessage, connectionError } = useChat(
        adminId,
        selectedUser.id
    );

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim()) return;
        sendMessage(messageInput);
        setMessageInput("");
    };

    return (
        <>
            <ChatHeader
                selectedUserName={selectedUser.name}
                isConnected={isConnected}
                connectionError={connectionError}
            />
            <ChatMessages
                messages={messages as any}
                adminId={String(adminId)}
                isLoading={isLoading}
                scrollRef={scrollRef as any}
            />
            <ChatInput
                messageInput={messageInput}
                onMessageChange={setMessageInput}
                onSend={handleSend}
                selectedUserName={selectedUser.name}
                isDisabled={!isConnected}
            />
        </>
    );
};

export default AdminChat;
