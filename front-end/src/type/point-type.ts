export type PointTransactionType =
    | "EARN"
    | "REDEEM"
    | "REFUND"
    | "ADMIN_ADJUST";

export interface PointHistoryResponse {
    id: number;
    pointDelta: number;
    balanceAfter: number;
    type: PointTransactionType;
    referenceId?: number;
    description: string;
    createdAt: string;
}

export interface UserPointSummaryResponse {
    currentPoints: number;
    totalAccumulatedPoints: number;
    membershipTier: string;
    pointsToNextTier: number;
}

export interface PointAdjustmentRequest {
    userId: number;
    amount: number; // Số dương để cộng, số âm để trừ
    type: PointTransactionType;
    description?: string;
}
