package project.back_end.request.UserRequest;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressRequest {
    @NotNull(message = "LOCATION_REQUIRED")
    private String location;
    @NotNull(message = "USERNAME_REQUIRED")
    private String userName;
    @NotNull(message = "PHONE_NUMBER_REQUIRED")
    @Size(min = 10, max = 10, message = "PHONE_NUMBER_SIZE_INVALID")
    private String phoneNumber;

    private Boolean isDefault = false;
}
