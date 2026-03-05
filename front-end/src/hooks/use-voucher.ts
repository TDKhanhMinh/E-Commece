"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as voucherService from "@/service/voucher-service";
import * as userVoucherService from "@/service/user-voucher-service";
import {
    CollectVoucherRequest,
    UserVoucherResponse,
    VoucherRequest,
    VoucherResponse,
} from "@/type/voucher-type";
import { PageResponse } from "@/type/api-type";

/**
 * Hook tổng hợp quản lý toàn bộ hệ thống Voucher (User & Admin)
 */
export const useVoucher = () => {
    const queryClient = useQueryClient();

    // ==========================================
    // 1. DÀNH CHO NGƯỜI DÙNG (USER)
    // ==========================================

    // Lấy ví voucher của tôi
    const useMyVouchers = () =>
        useQuery({
            queryKey: ["myVouchers"],
            queryFn: async () => {
                const response = await userVoucherService.getMyVouchers();
                return (
                    (response as unknown as PageResponse<UserVoucherResponse>) ||
                    []
                );
            },
            staleTime: 1000 * 60 * 5,
        });

    // Thu thập mã vào ví
    const collectVoucher = useMutation({
        mutationFn: (data: CollectVoucherRequest) =>
            userVoucherService.collectVoucher(data),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["myVouchers"] }),
    });

    // Kiểm tra mã khi thanh toán
    const validateVoucher = useMutation({
        mutationFn: async ({
            code,
            orderAmount,
        }: {
            code: string;
            orderAmount: number;
        }) => {
            const response = await voucherService.validateVoucher(
                code,
                orderAmount
            );
            return response as unknown as VoucherResponse;
        },
    });

    // ==========================================
    // 2. DÀNH CHO QUẢN TRỊ VIÊN (ADMIN)
    // ==========================================

    // Lấy danh sách tất cả Voucher hệ thống
    const useAdminVouchers = () =>
        useQuery({
            queryKey: ["admin", "vouchers"],
            queryFn: async () => {
                const response = await voucherService.getAllVouchers();
                console.log("Admin vouchers response:", response);
                return (
                    (response as unknown as PageResponse<VoucherResponse>) || []
                );
            },
        });

    const adminVoucherActions = {
        create: useMutation({
            mutationFn: (data: VoucherRequest) =>
                voucherService.createVoucher(data),
            onSuccess: () =>
                queryClient.invalidateQueries({
                    queryKey: ["admin", "vouchers"],
                }),
        }),
        update: useMutation({
            mutationFn: ({ id, data }: { id: number; data: VoucherRequest }) =>
                voucherService.updateVoucher(id, data),
            onSuccess: () =>
                queryClient.invalidateQueries({
                    queryKey: ["admin", "vouchers"],
                }),
        }),
        disable: useMutation({
            mutationFn: ({ id, action }: { id: number; action: boolean }) =>
                voucherService.disableVoucher(id, action),
            onSuccess: () =>
                queryClient.invalidateQueries({
                    queryKey: ["admin", "vouchers"],
                }),
        }),
    };

    // Quản lý ví của toàn bộ User
    const useAdminUserVouchers = () =>
        useQuery({
            queryKey: ["admin", "user-vouchers"],
            queryFn: async () => {
                const response = await userVoucherService.getAllUserVouchers();
                return (response as unknown as UserVoucherResponse[]) || [];
            },
        });

    // Thao tác cấp phát/thu hồi voucher
    const adminUserVoucherActions = {
        assign: useMutation({
            mutationFn: ({
                userId,
                voucherId,
            }: {
                userId: number;
                voucherId: number;
            }) => userVoucherService.assignVoucherToUser(userId, voucherId),
            onSuccess: () =>
                queryClient.invalidateQueries({
                    queryKey: ["admin", "user-vouchers"],
                }),
        }),
        remove: useMutation({
            mutationFn: (id: number) =>
                userVoucherService.removeVoucherFromUser(id),
            onSuccess: () =>
                queryClient.invalidateQueries({
                    queryKey: ["admin", "user-vouchers"],
                }),
        }),
    };

    return {
        // User exports
        useMyVouchers,
        collectVoucher,
        validateVoucher,

        // Admin exports
        useAdminVouchers,
        adminVoucherActions,
        useAdminUserVouchers,
        adminUserVoucherActions,
    };
};
