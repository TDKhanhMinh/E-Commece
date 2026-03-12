package project.back_end.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatRoomResponse {
    private Long id;
    private String chatId;
    private String participantOne;
    private String participantTwo;
    private Integer messageCount;
    private String lastMessageContent;
    private String userName;
    private LocalDateTime lastMessageTime;
}

