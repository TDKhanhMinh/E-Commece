export interface ChatMessage {
    id?: number;
    senderId: string;
    recipientId: string;
    content: string;
    type: "TEXT" | "RECOMMENDATION" | "IMAGE" | "SYSTEM";
    timestamp?: string;
}

export interface ChatRoomResponse {
    id: number;
    chatId: string;
    participantOne: string;
    participantTwo: string;
    messageCount?: number;
    lastMessageTime?: string;
    messages?: ChatMessage[];
    recipientName?: string;
    userName?: string;
    lastMessageContent?: string;
}
