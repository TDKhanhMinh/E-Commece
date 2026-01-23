package project.back_end.response;

import lombok.Builder;
import lombok.Data;
import project.back_end.dto.user.UserDTO;

@Data
@Builder
public class AuthResponse {
    private String token;
    private UserDTO user;

    public AuthResponse(String jwtToken, UserDTO user) {
        this.token = jwtToken;
        this.user = user;
    }
}
