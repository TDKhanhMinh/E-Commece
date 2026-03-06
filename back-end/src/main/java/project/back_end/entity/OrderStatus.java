package project.back_end.entity;


public enum OrderStatus {
    PENDING,        // Đơn hàng vừa tạo chưa được xác nhận
    CONFIRMED,      // Đã xác nhận (COD)
    PAID,           // Thanh toán thành công
    UNPAID,         // Chưa thanh toán (online)
    SHIPPING,       // Đang giao hàng
    DELIVERED,      // Giao hàng thành công
    CANCELLED,      // Đơn hàng bị hủy
    FAILED          // Thanh toán thất bại
}
