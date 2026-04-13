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
public class AdminDeliveryResponse {
    private Long deliveryId;
    private Long orderId;
    private String customerName;
    private String customerPhone;
    private String destination;
    private String latitude;
    private String longitude;
    private String proofImageUrl;

    private ShipperProfileResponse shipperProfile;
    private Double codAmount;
    private String paymentStatus;
    private String deliveryStatus;
    private LocalDateTime createdAt;
}