// Enum/Type cho loại giảm giá
export type DiscountType = "FIXED" | "PERCENTAGE";

// ==========================================
// 1. TYPES CHO VOUCHER (QUẢN LÝ TỔNG)
// ==========================================

/**
 * Type dùng để hiển thị dữ liệu Voucher lấy từ Backend về (Tương ứng VoucherResponse.java)
 */
export interface VoucherResponse {
    id: number;
    code: string;
    description: string;
    discountValue: number;
    discountType: DiscountType;
    minOrder: number;
    maxDiscount?: number | null; // Có thể null nếu discountType là FIXED
    usageLimit?: number | null;
    usedCount: number;
    startDate: string; // ISO String format (VD: "2024-12-31T23:59:59")
    endDate: string;
    active: boolean;
}

/**
 * Type dùng để gửi dữ liệu lên Backend khi Tạo mới / Cập nhật Voucher (Tương ứng VoucherRequest.java)
 */
export interface VoucherRequest {
    code: string;
    description: string;
    discountValue: number;
    discountType: DiscountType;
    minOrder: number;
    maxDiscount?: number | null;
    usageLimit?: number | null;
    startDate: string; // Yêu cầu format ISO string khi gửi lên Spring Boot
    endDate: string;
    active: boolean;
}

// ==========================================
// 2. TYPES CHO VÍ VOUCHER CỦA USER (USER-VOUCHER)
// ==========================================

/**
 * Type dùng để hiển thị danh sách Voucher trong ví của User (Tương ứng UserVoucherResponse.java)
 */
export interface UserVoucherResponse {
    id: number; // ID của bản ghi UserVoucher (không phải ID của Voucher)
    userId: number;
    voucher: VoucherResponse; // Chứa toàn bộ thông tin chi tiết của mã giảm giá
    isUsed: boolean;
    assignedAt: string;
    usedAt?: string | null; // Có thể null nếu chưa sử dụng
}

/**
 * Type dùng để gửi request khi User nhấn "Lưu mã" hoặc "Thu thập mã"
 */
export interface CollectVoucherRequest {
    code: string;
}
