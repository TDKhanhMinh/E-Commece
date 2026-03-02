package project.back_end.entity;


public enum OrderStatus {

    PENDING,        // Đơn hàng vừa tạo, chưa thanh toán
    CONFIRMED,      // Đã xác nhận (COD hoặc đã tạo giao dịch)
    PAID,           // Thanh toán thành công
    SHIPPING,       // Đang giao hàng
    DELIVERED,      // Giao hàng thành công
    CANCELLED,      // Đơn hàng bị hủy
    FAILED          // Thanh toán thất bại
}
