package project.back_end.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import project.back_end.response.ApiResponse;
import project.back_end.response.BalanceAndRevenueResponse;
import project.back_end.response.WalletTransactionResponse;
import project.back_end.service.WalletService;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletTransactionController {
    private final WalletService walletService;

    @GetMapping("/transactions")
    @PreAuthorize("hasRole('SHIPPER')")

    public ResponseEntity<ApiResponse<Page<WalletTransactionResponse>>> getWalletTransactions(
            @AuthenticationPrincipal UserDetails userDetails,
            Pageable pageable
    ) {
        String email = userDetails.getUsername();
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", walletService.getShipperHistoryTransactions(email, pageable)));
    }

    @GetMapping("/balance")
    @PreAuthorize("hasRole('SHIPPER')")
    public ResponseEntity<ApiResponse<BalanceAndRevenueResponse>> getShipperBalance(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", walletService.getShipperBalanceAndRevenue(email)));
    }

    @GetMapping("/transactions/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<WalletTransactionResponse>>> getAllTransactions(
            Pageable pageable,
            @RequestParam(defaultValue = "ALL") String status,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate

    ) {
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", walletService.getAllTransactions(status, pageable, type, action, startDate, endDate)));
    }

}
