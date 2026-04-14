package project.back_end.response;

import lombok.*;

@AllArgsConstructor
@Data
@Getter
@Setter
@NoArgsConstructor
public class NotificationResponse {
    private Long notificationId;
    private String title;
    private String message;
    private String type;
    private Boolean isRead;
    private String createdAt;
}
