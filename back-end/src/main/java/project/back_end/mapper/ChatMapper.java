package project.back_end.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import project.back_end.entity.ChatMessage;
import project.back_end.entity.ChatRoom;
import project.back_end.request.ChatRequest;
import project.back_end.response.ChatResponse;
import project.back_end.response.ChatRoomResponse;

import java.time.LocalDateTime;
import java.util.List;

@Mapper(componentModel = "spring")
public interface ChatMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "timestamp", ignore = true)
    @Mapping(target = "chatRoom", ignore = true)
    @Mapping(source = "recipientId", target = "receiverId")
    ChatMessage toEntity(ChatRequest request);

    @Mapping(source = "receiverId", target = "recipientId")
    ChatResponse toResponse(ChatMessage entity);

    // ==================== ADMIN MAPPERS ====================

    /**
     * Map ChatRoom sang ChatRoomResponse
     * Tự động tính toán messageCount và lastMessageTime
     */
    default ChatRoomResponse toChatRoomResponse(ChatRoom chatRoom) {
        if (chatRoom == null) {
            return null;
        }

        int messageCount = chatRoom.getMessages() != null ? chatRoom.getMessages().size() : 0;
        LocalDateTime lastMessageTime = null;
        String lastMessageContent = null;

        if (chatRoom.getMessages() != null && !chatRoom.getMessages().isEmpty()) {
            lastMessageTime = chatRoom.getMessages()
                    .get(chatRoom.getMessages().size() - 1)
                    .getTimestamp();
            lastMessageContent = chatRoom.getMessages()
                    .get(chatRoom.getMessages().size() - 1)
                    .getContent();
        }

        return ChatRoomResponse.builder()
                .id(chatRoom.getId())
                .chatId(chatRoom.getChatId())
                .participantOne(chatRoom.getParticipantOne())
                .participantTwo(chatRoom.getParticipantTwo())
                .messageCount(messageCount)
                .lastMessageContent(lastMessageContent)
                .userName(chatRoom.getUserName())
                .lastMessageTime(lastMessageTime)
                .build();
    }

    /**
     * Map danh sách ChatRoom sang danh sách ChatRoomResponse
     */
    default List<ChatRoomResponse> toChatRoomResponseList(List<ChatRoom> chatRooms) {
        if (chatRooms == null) {
            return null;
        }
        return chatRooms.stream()
                .map(this::toChatRoomResponse)
                .toList();
    }
}
