package project.back_end.controller;


import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.back_end.request.PaymentRequest;
import project.back_end.response.ApiResponse;
import project.back_end.service.OrderService;
import project.back_end.service.WalletService;
import project.back_end.service.impl.VnPayService;

import java.util.Map;

@RestController
@RequestMapping("/api/vnpay")
public class VnPayController {

    private final VnPayService vnPayService;
    private final OrderService orderService;
    private final WalletService walletService;

    public VnPayController(VnPayService vnPayService, OrderService orderService, WalletService walletService) {
        this.vnPayService = vnPayService;
        this.orderService = orderService;
        this.walletService = walletService;
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<String>> createPayment(
            @RequestBody PaymentRequest paymentRequest,
            HttpServletRequest request
    ) {
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Tạo URL thanh toán thành công", vnPayService.createPaymentUrl(paymentRequest, request))
        );
    }

    @GetMapping("/vnpay-return")
    public ResponseEntity<ApiResponse<String>> paymentReturn(@RequestParam Map<String, String> params) {

        String responseCode = params.get("vnp_ResponseCode");

        if ("00".equals(responseCode)) {

            return ResponseEntity.ok(new ApiResponse<>(200, "Thanh toán thành công", null));

        } else {

            return ResponseEntity.ok(new ApiResponse<>(500, "Thanh toán thất bại", null));
        }

    }

    @GetMapping("/vnpay-ipn")
    public ResponseEntity<ApiResponse<String>> ipn(@RequestParam Map<String, String> params) {

        String responseCode = params.get("vnp_ResponseCode");
        String orderId = params.get("vnp_TxnRef");

        if ("00".equals(responseCode)) {

            // Update trạng thái đơn hàng trong database
            orderService.updateOrderStatus(Long.valueOf(orderId), "PAID");

            // Tạo payment transaction lưu thông tin giao dịch
            walletService.createPaymentTransaction(Long.valueOf(orderId), params);

            return ResponseEntity.ok(new ApiResponse<>(200, "OK", null));
        }
        return ResponseEntity.ok(new ApiResponse<>(500, "FAILED", null));


    }

}