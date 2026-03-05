package project.back_end.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import project.back_end.dto.user.UserDTO;
import project.back_end.request.VoucherRequest.VoucherRequest;
import project.back_end.response.ApiResponse;
import project.back_end.response.VoucherResponse;
import project.back_end.service.UserService;
import project.back_end.service.VoucherService;

@RestController
@RequestMapping("/api/vouchers")
@RequiredArgsConstructor
@Slf4j
public class VoucherController {

    private final VoucherService voucherService;
    private final UserService userService;

    // ================= API CHO NGƯỜI DÙNG =================

    @GetMapping("/validate")
    public ResponseEntity<ApiResponse<VoucherResponse>> validateVoucher(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String code,
            @RequestParam Double orderAmount) {

        String username = userDetails.getUsername();
        log.info("User {} is validating voucher code: {} with amount: {}", username, code, orderAmount);

        UserDTO userDTO = userService.getUserProfile(username);

        VoucherResponse response = voucherService.validateVoucher(userDTO.getId(), code, orderAmount);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Voucher is valid", response)
        );
    }

    // ================= API CHO ADMIN =================
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<VoucherResponse>> createVoucher(
            @Valid @RequestBody VoucherRequest request) {

        log.info("Admin creating new voucher: {}", request.getCode());
        VoucherResponse response = voucherService.createVoucher(request);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Voucher created successfully", response)
        );
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<Page<VoucherResponse>>> getAllVouchers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        log.info("Fetching all vouchers - Page: {}, Size: {}", page, size);
        Pageable pageable = PageRequest.of(page, size);

        Page<VoucherResponse> responses = voucherService.getAllVouchers(pageable);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Fetched all vouchers successfully", responses)
        );
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VoucherResponse>> getVoucherById(@PathVariable Long id) {
        log.info("Fetching voucher with ID: {}", id);
        VoucherResponse response = voucherService.getVoucherById(id);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Voucher fetched successfully", response)
        );
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VoucherResponse>> updateVoucher(
            @PathVariable Long id,
            @Valid @RequestBody VoucherRequest request) {

        log.info("Admin updating voucher with ID: {}", id);
        VoucherResponse response = voucherService.updateVoucher(id, request);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Voucher updated successfully", response)
        );
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> disableVoucher(@PathVariable Long id, @RequestParam Boolean action) {
        log.info("Admin disabling voucher with ID: {}", id);
        voucherService.disableVoucher(id, action);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Voucher disabled successfully", null)
        );
    }
}