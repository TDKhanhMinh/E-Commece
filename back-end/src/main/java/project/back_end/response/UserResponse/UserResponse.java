package project.back_end.response.UserResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private Boolean isActive;
    private String avatarUrl;
    private LocalDateTime createdAt;
}
