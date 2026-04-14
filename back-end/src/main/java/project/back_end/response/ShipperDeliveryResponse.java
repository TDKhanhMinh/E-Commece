package project.back_end.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ShipperDeliveryResponse {
    private Long deliveryId;
    private Long orderId;
    private String customerName;
    private String customerPhone;
    private String destination;
    private String latitude;
    private String longitude;
    private Double codAmount;
    private String deliveryStatus;
    private String proofImageUrl;
    private String pickupLocation;
    private String pickupLatitude;
    private String pickupLongitude;
    private String shippingCost;
    private String distanceText;
    private String createdAt;
    private String encodedPolyline;
    private List<CheckoutItemResponse> items;


}
