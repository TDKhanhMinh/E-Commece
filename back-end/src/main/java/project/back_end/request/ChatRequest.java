package project.back_end.request;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import project.back_end.entity.MessageType;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatRequest {
    private String senderId;
    private String recipientId;
    private String content;
    private MessageType type;
}