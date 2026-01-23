package project.back_end.response.UserResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryAddressResponse {
    private Long id;
    private String location;
    private String userName;
    private String phoneNumber;
    private Boolean isDefault;
}
