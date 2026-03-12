package project.back_end.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import project.back_end.entity.ChatMessage;
import project.back_end.entity.ChatRoom;
import project.back_end.mapper.ChatMapper;
import project.back_end.request.ChatRequest;
import project.back_end.response.ApiResponse;
import project.back_end.response.ChatResponse;
import project.back_end.response.ChatRoomResponse;
import project.back_end.service.ChatService;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;
    private final ChatMapper chatMapper;

    /**
     * WEBSOCKET ENDPOINT: Xử lý gửi/nhận tin nhắn thời gian thực
     * Client gửi tới: /app/chat
     */
    @MessageMapping("/chat")
    public void processMessage(@Payload ChatRequest chatRequest) {
        log.info("[WS] Nhận tin nhắn từ: {} → {}", chatRequest.getSenderId(), chatRequest.getRecipientId());

        // 1. Lấy hoặc tạo ChatID duy nhất giữa 2 người
        String chatId = chatService.getChatRoomId(
                chatRequest.getSenderId(),
                chatRequest.getRecipientId(),
                true
        );
        log.info("ChatID: {}", chatId);

        // 2. Chuyển đổi và lưu vào MySQL
        ChatMessage messageEntity = chatMapper.toEntity(chatRequest);
        ChatMessage savedMsg = chatService.saveMessage(messageEntity, chatId);
        log.info("Đã lưu tin nhắn ID: {}", savedMsg.getId());

        // 3. Map sang Response DTO
        ChatResponse response = chatMapper.toResponse(savedMsg);

        // 4. Gửi tới Topic của người nhận: /user/{recipientId}/topic/messages
        log.info("Gửi tới recipient: /user/{}/topic/messages", chatRequest.getRecipientId());
        messagingTemplate.convertAndSendToUser(
                chatRequest.getRecipientId(),
                "/topic/messages",
                response
        );

        // 5. Gửi ngược lại cho chính người gửi để cập nhật giao diện
        log.info(" Gửi tới sender: /user/{}/topic/messages", chatRequest.getSenderId());
        messagingTemplate.convertAndSendToUser(
                chatRequest.getSenderId(),
                "/topic/messages",
                response
        );

        log.info("[WS] Hoàn thành xử lý tin nhắn ID: {}", savedMsg.getId());
    }

    /**
     * HTTP GET: Lấy lịch sử tin nhắn của một phòng chat
     */
    @GetMapping("/messages/{senderId}/{recipientId}")
    public ResponseEntity<ApiResponse<List<ChatResponse>>> getChatHistory(
            @PathVariable String senderId,
            @PathVariable String recipientId
    ) {
        String chatId = chatService.getChatRoomId(senderId, recipientId, true);

        if (chatId == null) {
            return ResponseEntity.ok(new ApiResponse<>(200, "Phòng chat chưa tồn tại", List.of()));
        }

        List<ChatResponse> history = chatService.getChatMessages(chatId)
                .stream()
                .map(chatMapper::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                new ApiResponse<>(200, "Lấy lịch sử tin nhắn thành công", history)
        );
    }

    /**
     * HTTP DELETE: Xóa lịch sử chat
     */
    @DeleteMapping("/messages/{chatId}")
    public ResponseEntity<ApiResponse<Void>> clearChatHistory(@PathVariable String chatId) {
        log.info("Xóa lịch sử phòng chat: {}", chatId);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Đã xóa toàn bộ tin nhắn", null)
        );
    }

    // ==================== ADMIN ENDPOINTS ====================

    /**
     * HTTP GET: Admin lấy tất cả các phòng chat
     * GET /api/chat/admin/chat-rooms
     */
    @GetMapping("/admin/chat-rooms")
    public ResponseEntity<ApiResponse<List<ChatRoomResponse>>> getAllChatRooms() {
        log.info("Admin lấy tất cả các phòng chat");
        List<ChatRoom> chatRooms = chatService.getAllChatRooms();

        List<ChatRoomResponse> responses = chatMapper.toChatRoomResponseList(chatRooms);

        return ResponseEntity.ok(
                new ApiResponse<>(200, "Lấy tất cả phòng chat thành công", responses)
        );
    }

    /**
     * HTTP GET: Admin lấy chi tiết một phòng chat
     * GET /api/chat/admin/chat-rooms/{chatRoomId}
     */
    @GetMapping("/admin/chat-rooms/{chatRoomId}")
    public ResponseEntity<ApiResponse<ChatRoomResponse>> getChatRoomDetail(
            @PathVariable Long chatRoomId
    ) {
        log.info("Admin lấy chi tiết phòng chat: {}", chatRoomId);
        ChatRoom room = chatService.getChatRoomDetails(chatRoomId);

        ChatRoomResponse response = chatMapper.toChatRoomResponse(room);

        return ResponseEntity.ok(
                new ApiResponse<>(200, "Lấy chi tiết phòng chat thành công", response)
        );
    }

    /**
     * HTTP DELETE: Admin xóa một phòng chat (và tất cả tin nhắn trong đó)
     * DELETE /api/chat/admin/chat-rooms/{chatRoomId}
     */
    @DeleteMapping("/admin/chat-rooms/{chatRoomId}")
    public ResponseEntity<ApiResponse<Void>> deleteChatRoom(
            @PathVariable Long chatRoomId
    ) {
        log.info("Admin xóa phòng chat: {}", chatRoomId);
        chatService.deleteChatRoom(chatRoomId);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Đã xóa phòng chat và toàn bộ tin nhắn", null)
        );
    }

    /**
     * HTTP GET: Admin lấy lịch sử tin nhắn của một phòng chat
     * GET /api/chat/admin/chat-rooms/{chatRoomId}/messages
     */
    @GetMapping("/admin/chat-rooms/{chatRoomId}/messages")
    public ResponseEntity<ApiResponse<List<ChatResponse>>> getChatRoomMessages(
            @PathVariable Long chatRoomId
    ) {
        log.info("Admin lấy lịch sử tin nhắn phòng chat: {}", chatRoomId);
        ChatRoom room = chatService.getChatRoomDetails(chatRoomId);

        List<ChatResponse> messages = room.getMessages().stream()
                .map(chatMapper::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                new ApiResponse<>(200, "Lấy lịch sử tin nhắn thành công", messages)
        );
    }
}
