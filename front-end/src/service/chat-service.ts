import http from "@/service/http";
import { ApiResponse } from "@/type/api-type";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { ChatMessage, ChatRoomResponse } from "@/type/chat-type";

// ==================== USER HTTP ENDPOINTS ====================
export const getChatHistory = async (senderId: string, recipientId: string) => {
    return http.get<ApiResponse<ChatMessage[]>>(
        `/chat/messages/${senderId}/${recipientId}`
    );
};

export const deleteChatHistory = async (chatId: string) => {
    return http.delete<ApiResponse<void>>(`/chat/messages/${chatId}`);
};

// ==================== ADMIN HTTP ENDPOINTS ====================
// Map to GET /api/chat/admin/chat-rooms
export const getAllChatRooms = async () => {
    const data = await http.get<ApiResponse<ChatRoomResponse[]>>(
        "/chat/admin/chat-rooms"
    );
    console.log("Fetched chat rooms:", data);
    return data;
};

// Map to GET /api/chat/admin/chat-rooms/{chatRoomId}
export const getChatRoomDetail = async (chatRoomId: number) => {
    return http.get<ApiResponse<ChatRoomResponse>>(
        `/chat/admin/chat-rooms/${chatRoomId}`
    );
};

// Map to DELETE /api/chat/admin/chat-rooms/{chatRoomId}
export const deleteChatRoom = async (chatRoomId: number) => {
    return http.delete<ApiResponse<void>>(
        `/chat/admin/chat-rooms/${chatRoomId}`
    );
};

// Map to GET /api/chat/admin/chat-rooms/{chatRoomId}/messages
export const getChatRoomMessages = async (chatRoomId: number) => {
    return http.get<ApiResponse<ChatMessage[]>>(
        `/chat/admin/chat-rooms/${chatRoomId}/messages`
    );
};

// ==================== WEBSOCKET SERVICE (Real-time) ====================
export class ChatWebSocketService {
    private stompClient: Client | null = null;
    private isConnecting = false;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 3000;
    private onConnectionStateChange?: (isConnected: boolean) => void;
    private onError?: (error: string) => void;
    private receivedMessageIds = new Set<number>();

    connect(
        onMessageReceived: (message: ChatMessage) => void,
        userId: string,
        onConnectionStateChange?: (isConnected: boolean) => void,
        onError?: (error: string) => void
    ) {
        this.onConnectionStateChange = onConnectionStateChange;
        this.onError = onError;

        if (
            this.isConnecting ||
            (this.stompClient && this.stompClient.connected)
        ) {
            console.log("WebSocket đã kết nối hoặc đang kết nối");
            return;
        }

        https: this.isConnecting = true;
        console.log("Đang kết nối WebSocket cho user:", userId);
        const wsUrl = process.env.NEXT_PUBLIC_API_URL
            ? process.env.NEXT_PUBLIC_API_URL + "/ws-chat"
            : "https://api.voipelearning.shop/api/ws-chat";
        const socket = new SockJS(wsUrl);
        console.log("Đã tạo SockJS client với URL:", wsUrl);

        this.stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: this.reconnectDelay,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: (str) => {
                console.log("[STOMP Debug]", str);
            },
            onConnect: () => {
                console.log("WebSocket đã kết nối thành công");
                this.isConnecting = false;
                this.reconnectAttempts = 0;

                this.onConnectionStateChange?.(true);

                const subscriptionPath = `/user/${userId}/topic/messages`;
                console.log("Đang subscribe:", subscriptionPath);

                this.stompClient?.subscribe(
                    subscriptionPath,
                    (payload) => {
                        try {
                            const rawMessage = JSON.parse(payload.body);
                            const message: ChatMessage = {
                                ...rawMessage,
                                senderId: String(rawMessage.senderId ?? ""),
                                recipientId: String(
                                    rawMessage.recipientId ?? ""
                                ),
                            };
                            console.log("Nhận tin nhắn từ WebSocket:", message);

                            if (
                                message.id &&
                                this.receivedMessageIds.has(message.id)
                            ) {
                                console.log(
                                    "Tin nhắn trùng lặp, bỏ qua:",
                                    message.id
                                );
                                return;
                            }

                            if (message.id) {
                                this.receivedMessageIds.add(message.id);
                            }

                            onMessageReceived(message);
                        } catch (error) {
                            console.error("Lỗi parse tin nhắn:", error);
                        }
                    },
                    { id: `sub-${userId}-messages` }
                );

                console.log(`Đã subscribe thành công: ${subscriptionPath}`);
            },
            onDisconnect: () => {
                console.log("WebSocket đã ngắt kết nối");
                this.isConnecting = false;
                this.onConnectionStateChange?.(false);
            },
            onStompError: (frame) => {
                console.error("STOMP Error:", frame.headers["message"]);
                console.error("Frame body:", frame.body);
                this.isConnecting = false;
                const errorMsg = frame.headers["message"] || "WebSocket error";
                this.onError?.(errorMsg);
                this.onConnectionStateChange?.(false);
                this.attemptReconnect(onMessageReceived, userId);
            },
            onWebSocketError: (error) => {
                console.error("WebSocket Connection Error:", error);
                this.isConnecting = false;
                this.onError?.("Không thể kết nối tới server");
                this.onConnectionStateChange?.(false);
                this.attemptReconnect(onMessageReceived, userId);
            },
        });

        this.stompClient.activate();
    }

    private attemptReconnect(
        onMessageReceived: (message: ChatMessage) => void,
        userId: string
    ) {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(
                `Đang thử kết nối lại... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
            );
            setTimeout(() => {
                this.connect(
                    onMessageReceived,
                    userId,
                    this.onConnectionStateChange,
                    this.onError
                );
            }, this.reconnectDelay * this.reconnectAttempts);
        } else {
            console.error("Đã thử kết nối lại tối đa, không thành công");
            this.onError?.("Không thể kết nối sau nhiều lần thử");
        }
    }

    sendMessage(chatRequest: ChatMessage) {
        if (this.stompClient && this.stompClient.connected) {
            try {
                console.log("Đang gửi tin nhắn:", chatRequest);

                this.stompClient.publish({
                    destination: "/app/chat",
                    body: JSON.stringify(chatRequest),
                });

                console.log("Tin nhắn đã gửi thành công");
            } catch (error) {
                console.error("Lỗi khi gửi tin nhắn:", error);
            }
        } else {
            console.error("WebSocket chưa kết nối. Trạng thái:", {
                hasClient: !!this.stompClient,
                isConnected: this.stompClient?.connected,
                isConnecting: this.isConnecting,
            });
        }
    }

    isConnected(): boolean {
        return !!(this.stompClient && this.stompClient.connected);
    }

    disconnect() {
        if (this.stompClient) {
            this.stompClient.deactivate();
            this.stompClient = null;
            this.receivedMessageIds.clear();
            this.isConnecting = false;
        }
    }
}
