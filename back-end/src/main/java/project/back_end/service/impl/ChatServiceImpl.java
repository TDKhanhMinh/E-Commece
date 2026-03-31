package project.back_end.service.impl;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.back_end.entity.ChatMessage;
import project.back_end.entity.ChatRoom;
import project.back_end.entity.User;
import project.back_end.exception.AppException;
import project.back_end.exception.ErrorCode;
import project.back_end.repository.ChatMessageRepository;
import project.back_end.repository.ChatRoomRepository;
import project.back_end.repository.UserRepository;
import project.back_end.service.ChatService;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatMessageRepository messageRepository;
    private final ChatRoomRepository roomRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ChatMessage saveMessage(ChatMessage chatMessage, String chatId) {
        ChatRoom room = roomRepository.findByChatId(chatId)
                .orElseThrow(() -> new AppException(ErrorCode.CHAT_ROOM_NOT_FOUND));

        chatMessage.setChatRoom(room);
        return messageRepository.save(chatMessage);
    }

    public boolean isAdmin(String userId) {
        User user = userRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return user.getRole().name().equals("ADMIN");
    }

    @Override
    @Transactional
    public String getChatRoomId(String senderId, String recipientId, boolean createIfNotExist) {
        String chatId = createChatId(senderId, recipientId);
        String userId = isAdmin(senderId) ? recipientId : senderId;
        User user = userRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        log.info("User ID: {}, User Role: {}", userId, user.getRole().name());
        return roomRepository.findByChatId(chatId)
                .map(ChatRoom::getChatId)
                .orElseGet(() -> {
                    if (createIfNotExist) {
                        ChatRoom newRoom = new ChatRoom();
                        newRoom.setChatId(chatId);
                        newRoom.setParticipantOne(senderId);
                        newRoom.setParticipantTwo(recipientId);
                        newRoom.setUserName(user.getName());
                        newRoom.setLastMessageContent("");
                        roomRepository.save(newRoom);
                        return chatId;
                    }
                    return null;
                });
    }

    @Override
    public List<ChatMessage> getChatMessages(String chatId) {
        return messageRepository.findByChatRoomChatId(chatId);
    }

    @Override
    public List<ChatRoom> getAllChatRooms() {
        return roomRepository.findAll();
    }

    @Override
    public ChatRoom getChatRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CHAT_ROOM_NOT_FOUND));
    }

    @Override
    @Transactional
    public void deleteChatRoom(Long id) {
        ChatRoom room = roomRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CHAT_ROOM_NOT_FOUND));

        messageRepository.deleteAllByChatRoomId(id);

        roomRepository.deleteById(id);
    }

    @Override
    public ChatRoom getChatRoomDetails(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CHAT_ROOM_NOT_FOUND));
    }

    private String createChatId(String id1, String id2) {
        return id1.compareTo(id2) < 0 ? id1 + "_" + id2 : id2 + "_" + id1;
    }
}