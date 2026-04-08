package project.back_end.response;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class DeliveryAddressResponse {

    private String location;
    private String userName;
    private String phoneNumber;
    private String latitude;
    private String longitude;
}
