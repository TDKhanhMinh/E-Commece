package project.back_end.service;


import org.springframework.stereotype.Service;
import project.back_end.entity.ChatMessage;
import project.back_end.entity.ChatRoom;

import java.util.List;

@Service
public interface ChatService {
    // Lưu tin nhắn mới vào database
    ChatMessage saveMessage(ChatMessage chatMessage, String chatId);

    // Lấy hoặc tạo mới phòng chat giữa 2 người
    String getChatRoomId(String senderId, String recipientId, boolean createIfNotExist);

    // Lấy lịch sử tin nhắn
    List<ChatMessage> getChatMessages(String chatId);

    // Admin: Lấy tất cả các phòng chat
    List<ChatRoom> getAllChatRooms();

    // Admin: Lấy phòng chat theo ID
    ChatRoom getChatRoomById(Long id);

    // Admin: Xóa phòng chat và tất cả tin nhắn trong đó
    void deleteChatRoom(Long id);

    // Admin: Lấy chi tiết phòng chat (số lượng tin nhắn, tin nhắn cuối cùng, etc.)
    ChatRoom getChatRoomDetails(Long id);
}
