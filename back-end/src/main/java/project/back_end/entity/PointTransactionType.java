package project.back_end.entity;

public enum PointTransactionType {
    EARN,    // Tích lũy điểm từ đơn hàng hoặc sự kiện
    REDEEM,  // Sử dụng điểm để giảm giá hoặc đổi quà
    REFUND,  // Hoàn lại điểm khi hủy đơn hàng
    EXPIRED, // Điểm hết hạn sử dụng
    ADMIN_ADJUST // Admin điều chỉnh thủ công
}