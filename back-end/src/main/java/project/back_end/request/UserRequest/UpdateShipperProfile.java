package project.back_end.request.UserRequest;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class UpdateShipperProfile {
    private String name;
    private String phone;
    private String avatarUrl;
    private String vehicleType;
    private String licensePlate;
    private String citizenIdentificationNumber;
}
