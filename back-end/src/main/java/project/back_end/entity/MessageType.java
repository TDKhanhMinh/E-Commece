package project.back_end.entity;

public enum MessageType {
    TEXT,           // Tin nhắn thuần hiện tại
    RECOMMENDATION, // Dành cho AI gợi ý sản phẩm/khóa học sau này
    IMAGE,
    SYSTEM          // Thông báo hệ thống (vào phòng/thoát phòng)
}