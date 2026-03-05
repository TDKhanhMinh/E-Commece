package project.back_end.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import project.back_end.dto.user.UserDTO;
import project.back_end.request.VoucherRequest.CollectVoucherRequest;
import project.back_end.response.ApiResponse;
import project.back_end.response.UserVoucherResponse;
import project.back_end.service.UserService;
import project.back_end.service.UserVoucherService;
import project.back_end.service.VoucherService;

import java.util.List;

@RestController
@RequestMapping("/api/user-vouchers")
@RequiredArgsConstructor
@Slf4j
public class UserVoucherController {

    private final UserVoucherService userVoucherService;
    private final VoucherService voucherService;
    private final UserService userService;

    // ================= API CHO NGƯỜI DÙNG =================

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<UserVoucherResponse>>> getMyVouchers(
            @AuthenticationPrincipal UserDetails userDetails) {

        String username = userDetails.getUsername();
        log.info("Fetching voucher wallet for user: {}", username);

        // Lấy ID user từ token
        UserDTO userDTO = userService.getUserProfile(username);

        List<UserVoucherResponse> responses = voucherService.getUserVoucherWallet(userDTO.getId());
        return ResponseEntity.ok(
                new ApiResponse<>(200, "User voucher wallet fetched successfully", responses)
        );
    }

    @PostMapping("/collect")
    public ResponseEntity<ApiResponse<Void>> collectVoucher(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CollectVoucherRequest request) {

        String username = userDetails.getUsername();
        log.info("User {} is collecting voucher: {}", username, request.getCode());

        UserDTO userDTO = userService.getUserProfile(username);

        // Gọi hàm thu thập voucher
        voucherService.collectVoucher(userDTO.getId(), request.getCode());

        return ResponseEntity.ok(
                new ApiResponse<>(200, "Voucher collected successfully", null)
        );
    }

    // ================= API CHO ADMIN =================
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/assign")
    public ResponseEntity<ApiResponse<UserVoucherResponse>> assignVoucherToUser(
            @RequestParam Long userId,
            @RequestParam Long voucherId) {

        log.info("Admin assigning voucher ID {} to user ID {}", voucherId, userId);
        UserVoucherResponse response = userVoucherService.assignVoucherToUser(userId, voucherId);
        return ResponseEntity.ok(
                new ApiResponse<>(201, "Voucher assigned to user successfully", response)
        );
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserVoucherResponse>>> getAllUserVouchers() {
        log.info("Admin fetching all user vouchers");
        List<UserVoucherResponse> responses = userVoucherService.getAllUserVouchers();
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Fetched all user vouchers successfully", responses)
        );
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> removeVoucherFromUser(@PathVariable Long id) {
        log.info("Admin removing user-voucher record with ID: {}", id);
        userVoucherService.removeVoucherFromUser(id);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Voucher removed from user successfully", null)
        );
    }
}