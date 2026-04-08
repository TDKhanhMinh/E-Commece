package project.back_end.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import project.back_end.entity.Delivery;
import project.back_end.entity.Order;
import project.back_end.entity.ShipperProfile;
import project.back_end.response.AdminDeliveryResponse;
import project.back_end.response.ShipperProfileResponse;

@Mapper(componentModel = "spring")
public interface DeliveryMapper {

    @Mapping(source = "id", target = "deliveryId")
    @Mapping(source = "order.id", target = "orderId")

    @Mapping(source = "order.deliveryAddress.userName", target = "customerName")
    @Mapping(source = "order.deliveryAddress.phoneNumber", target = "customerPhone")
    @Mapping(source = "order.deliveryAddress.location", target = "destination")
    @Mapping(source = "order.deliveryAddress.latitude", target = "latitude")
    @Mapping(source = "order.deliveryAddress.longitude", target = "longitude")

    @Mapping(source = "shipper", target = "shipperProfile")

    @Mapping(source = "amountToCollect", target = "codAmount")
    @Mapping(source = "status", target = "deliveryStatus")
    @Mapping(source = "createdAt", target = "createdAt")

    @Mapping(source = "order", target = "paymentStatus", qualifiedByName = "mapPaymentStatus")
    AdminDeliveryResponse toAdminDeliveryResponse(Delivery delivery);

    @Mapping(source = "userId", target = "userId")
    @Mapping(source = "user.name", target = "fullName")
    @Mapping(source = "user.email", target = "email")
    @Mapping(source = "user.phone", target = "phone")
    @Mapping(source = "vehicleType", target = "vehicleType")
    @Mapping(source = "licensePlate", target = "licensePlate")
    @Mapping(source = "citizenIdentificationCard", target = "citizenIdentificationCard")
    @Mapping(source = "isOnline", target = "isOnline")
    @Mapping(source = "currentLat", target = "currentLat")
    @Mapping(source = "currentLng", target = "currentLng")
    @Mapping(source = "balance", target = "balance")
    @Mapping(source = "ratingAverage", target = "ratingAverage")
    ShipperProfileResponse toShipperProfileResponse(ShipperProfile shipperProfile);

    @Named("mapPaymentStatus")
    default String mapPaymentStatus(Order order) {
        if (order == null) return "UNPAID";

        if ("PAID".equalsIgnoreCase(String.valueOf(order.getStatus())) || "PAYPAL".equalsIgnoreCase(order.getPaymentMethod())) {
            return "PAID";
        }
        return "UNPAID";
    }
}

