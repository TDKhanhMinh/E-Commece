package project.back_end.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ShipperProfileResponse {
    private Long userId;
    
    private String fullName;
    private String email;
    private String phone;

    private String vehicleType;
    private String licensePlate;
    private String citizenIdentificationCard;
    private Boolean isOnline;
    private Double currentLat;
    private Double currentLng;
    private Long balance;
    private Double ratingAverage;
}

