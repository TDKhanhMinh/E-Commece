package project.back_end.enumerate;

public enum NotificationType {
    SYSTEM,   // Tin hệ thống, thưởng, bảo trì
    INBOUND,  // Đơn hàng mới đến, đơn được gán
    OUTBOUND,  // Trạng thái đơn đang giao, giao thành công
    ORDER     // Thông báo trạng thái đơn hàng
}
