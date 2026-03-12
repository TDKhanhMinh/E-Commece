import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    ChatWebSocketService,
    deleteChatRoom,
    getAllChatRooms,
    getChatHistory,
    getChatRoomDetail,
    getChatRoomMessages,
} from "@/service/chat-service";
import { ChatMessage, ChatRoomResponse } from "@/type/chat-type";

export const useChat = (
    senderId: string | number,
    recipientId: string | number
) => {
    const normalizedSenderId = String(senderId ?? "");
    const normalizedRecipientId = String(recipientId ?? "");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);

    const wsRef = useRef<ChatWebSocketService | null>(null);
    const recipientIdRef = useRef(normalizedRecipientId);
    recipientIdRef.current = normalizedRecipientId;

    // Load chat history using TanStack Query
    const { isLoading } = useQuery({
        queryKey: ["chatHistory", normalizedSenderId, normalizedRecipientId],
        queryFn: async () => {
            // @ts-ignore
            const historyData = await getChatHistory(
                normalizedSenderId,
                normalizedRecipientId
            );
            const messageList = Array.isArray(historyData) ? historyData : [];
            setMessages(messageList);
            return messageList;
        },
        enabled: !!normalizedSenderId && !!normalizedRecipientId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // WebSocket connection — only reconnects when senderId changes
    useEffect(() => {
        if (!normalizedSenderId) return;

        const ws = new ChatWebSocketService();
        wsRef.current = ws;

        const handleNewMessage = (newMessage: ChatMessage) => {
            const currentRecipientId = recipientIdRef.current;
            const incomingSenderId = String(newMessage.senderId ?? "");
            const incomingRecipientId = String(newMessage.recipientId ?? "");

            const isRelevant =
                (incomingSenderId === normalizedSenderId &&
                    incomingRecipientId === currentRecipientId) ||
                (incomingSenderId === currentRecipientId &&
                    incomingRecipientId === normalizedSenderId);

            if (isRelevant) {
                setMessages((prev) => {
                    if (prev.some((msg) => msg.id === newMessage.id))
                        return prev;
                    return [...prev, newMessage];
                });
            }
        };

        ws.connect(
            handleNewMessage,
            normalizedSenderId,
            (connected) => {
                setIsConnected(connected);
                if (connected) setConnectionError(null);
            },
            (error) => {
                setConnectionError(error);
                setIsConnected(false);
            }
        );

        return () => {
            ws.disconnect();
            wsRef.current = null;
            setIsConnected(false);
        };
    }, [normalizedSenderId]);

    const sendMessage = useCallback(
        (content: string) => {
            if (!content.trim()) return;
            const chatRequest: ChatMessage = {
                senderId: normalizedSenderId,
                recipientId: normalizedRecipientId,
                content,
                type: "TEXT",
            };
            wsRef.current?.sendMessage(chatRequest);
        },
        [normalizedSenderId, normalizedRecipientId]
    );

    return { messages, isConnected, isLoading, sendMessage, connectionError };
};

// 2. HOOK: useAdminChatRooms (Dùng cho giao diện Quản lý Admin)
export const useAdminChatRooms = () => {
    const queryClient = useQueryClient();

    // Fetch all chat rooms
    const {
        data: chatRooms = [],
        isLoading: isLoadingRooms,
        refetch: fetchRooms,
    } = useQuery({
        queryKey: ["chatRooms"],
        queryFn: async () => {
            // @ts-ignore
            const data = await getAllChatRooms();
            return Array.isArray(data) ? data : [];
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
        gcTime: 1000 * 60 * 5, // 5 minutes (formerly cacheTime)
    });

    // Fetch room detail
    const {
        data: selectedRoomDetail = null,
        isLoading: isFetchingDetail,
    } = useQuery({
        queryKey: ["chatRoomDetail"],
        queryFn: async () => null,
        enabled: false,
        staleTime: 1000 * 60 * 2,
    });

    const handleFetchRoomDetail = async (chatRoomId: number) => {
        try {
            const data = await getChatRoomDetail(chatRoomId);
            // Cache the result manually for this query
            queryClient.setQueryData(["chatRoomDetail"], data);
            return data;
        } catch (error) {
            console.error(
                `Lỗi khi lấy chi tiết phòng chat ${chatRoomId}:`,
                error
            );
            return null;
        }
    };

    // Fetch room messages
    const handleFetchRoomMessages = async (chatRoomId: number) => {
        try {
            const response = await getChatRoomMessages(chatRoomId);
            // @ts-ignore
            const data = response.data ? response.data : response;
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error(
                `Lỗi khi lấy tin nhắn của phòng chat ${chatRoomId}:`,
                error
            );
            return [];
        }
    };

    // Delete room mutation
    const deleteRoomMutation = useMutation({
        mutationFn: async (chatRoomId: number) => {
            await deleteChatRoom(chatRoomId);
            return chatRoomId;
        },
        onSuccess: (deletedRoomId) => {
            // Update cache after successful deletion
            queryClient.setQueryData(
                ["chatRooms"],
                (oldData: ChatRoomResponse[]) =>
                    oldData.filter((room) => room.id !== deletedRoomId)
            );
            // Clear room detail cache if the deleted room was selected
            queryClient.setQueryData(["chatRoomDetail"], null);
        },
        onError: (error: any) => {
            console.error("Lỗi khi xóa phòng chat:", error);
        },
    });

    const removeRoom = (chatRoomId: number) => {
        deleteRoomMutation.mutate(chatRoomId);
    };

    return {
        chatRooms,
        isLoadingRooms,
        fetchRooms,
        removeRoom,
        fetchRoomDetail: handleFetchRoomDetail,
        selectedRoomDetail,
        isFetchingDetail,
        fetchRoomMessages: handleFetchRoomMessages,
        isDeleting: deleteRoomMutation.isPending,
    };
};
