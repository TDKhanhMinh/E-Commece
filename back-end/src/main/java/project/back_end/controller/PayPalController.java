package project.back_end.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import project.back_end.response.ApiResponse;
import project.back_end.service.OrderService;
import project.back_end.service.impl.PayPalService;

@Slf4j
@RestController
@RequestMapping("/api/paypal")
@RequiredArgsConstructor
public class PayPalController {

    private final PayPalService payPalService;
    private final OrderService orderService;

    /**
     * 1. API Khởi tạo giao dịch (Frontend gọi khi bấm nút PayPal)
     */
    @PostMapping("/create-order")
    public ResponseEntity<ApiResponse<String>> createOrder(@RequestParam Double amountInUsd) {
        log.info("Yêu cầu tạo PayPal Order với số tiền: ${}", amountInUsd);

        String paypalOrderId = payPalService.createOrder(amountInUsd);

        if (paypalOrderId != null) {
            return ResponseEntity.ok(new ApiResponse<>(200, "Tạo đơn hàng PayPal thành công", paypalOrderId));
        } else {
            return ResponseEntity.ok(new ApiResponse<>(500, "Không thể tạo đơn hàng PayPal", "CREATE_ORDER_FAILED"));
        }
    }

    /**
     * 2. API Bắt tiền (Frontend gọi sau khi khách hàng đồng ý thanh toán trên popup)
     */
    @PostMapping("/capture-order")
    public ResponseEntity<ApiResponse<String>> captureOrder(
            @RequestParam String paypalOrderId,
            @RequestParam Long orderId) {

        log.info("Yêu cầu capture PayPal Order ID: {} cho hệ thống Order ID: {}", paypalOrderId, orderId);

        // Gọi sang PayPal để thực hiện lệnh thu tiền
        boolean isSuccess = payPalService.captureOrder(paypalOrderId);

        if (isSuccess) {
            try {
                // Cập nhật trạng thái đơn hàng sang PAID
                orderService.updateOrderStatus(orderId, "PAID");

                log.info("Thanh toán thành công và đã cập nhật Order ID: {} thành PAID", orderId);
                return ResponseEntity.ok(new ApiResponse<>(200, "Thanh toán thành công", "SUCCESS"));

            } catch (Exception e) {
                log.error("Lỗi khi cập nhật trạng thái đơn hàng {} sau khi PayPal capture thành công: {}", orderId, e.getMessage(), e);
                return ResponseEntity.ok(new ApiResponse<>(500, "Thanh toán thành công nhưng lỗi cập nhật hệ thống. Vui lòng liên hệ hỗ trợ.", "PAYMENT_SUCCESS_BUT_UPDATE_FAILED"));
            }
        } else {
            log.warn("Capture PayPal Order ID: {} thất bại", paypalOrderId);
            orderService.updateOrderStatus(orderId, "FAILED");
            return ResponseEntity.ok(new ApiResponse<>(500, "Giao dịch bị từ chối hoặc thất bại", "PAYMENT_FAILED"));
        }
    }
}