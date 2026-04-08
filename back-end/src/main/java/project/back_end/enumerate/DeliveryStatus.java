package project.back_end.enumerate;

public enum DeliveryStatus {
    PENDING,    // Đơn hàng đã được tạo nhưng chưa được shipper nhận
    PICKED_UP,  // Shipper đã nhận đơn và đang trên đường đến lấy hàng
    DELIVERING, // Shipper đã lấy hàng và đang giao đến khách
    SUCCESS,    // Đơn hàng đã được giao thành công
    CANCELLED   // Đơn hàng đã bị hủy (có thể do khách hoặc shipper)
}