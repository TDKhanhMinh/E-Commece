package project.back_end.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import project.back_end.enumerate.MessageType;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatResponse {
    private Long id;
    private String senderId;
    private String recipientId;
    private String content;
    private MessageType type;
    private LocalDateTime timestamp;
}