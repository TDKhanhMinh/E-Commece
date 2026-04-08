package project.back_end.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import project.back_end.enumerate.OrderStatus;
import project.back_end.request.CheckoutRequest;
import project.back_end.response.ApiResponse;
import project.back_end.response.OrderResponse;
import project.back_end.service.OrderService;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /**
     * ======================
     * CREATE – Checkout
     * ======================
     */
    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<OrderResponse>> checkout(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid CheckoutRequest request
    ) {
        String username = userDetails.getUsername();
        OrderResponse response = orderService.checkout(username, request);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Checkout thành công", response)
        );
    }

    /**
     * ======================
     * READ – Get order by id
     * ======================
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
            @PathVariable Long orderId
    ) {
        OrderResponse response = orderService.getOrderDetail(orderId);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Lấy đơn hàng thành công", response)
        );
    }

    /**
     * ======================
     * READ – Get orders by user (paged, optional status)
     * ======================
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<OrderResponse>>> getOrdersByUser(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) OrderStatus status,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        String email = userDetails.getUsername();
        Page<OrderResponse> responses = orderService.getOrdersByUser(email, status, pageable);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Lấy đơn hàng người dùng thành công", responses)
        );
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Page<OrderResponse>>> getOrdersByAdmin(
            @RequestParam(required = false) OrderStatus status,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<OrderResponse> responses = orderService.getAllOrders(status, pageable);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Lấy đơn hàng người dùng bời quản trị viên thành công", responses)
        );
    }

    /**
     * ======================
     * UPDATE – Update order status
     * ======================
     */
    @PutMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse<Void>> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status
    ) {
        orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Cập nhật đơn hàng thành công", null)
        );
    }

    /**
     * ======================
     * DELETE – Cancel order
     * ======================
     */
    @DeleteMapping("/{orderId}")
    public ResponseEntity<ApiResponse<Void>> cancelOrder(
            @PathVariable Long orderId
    ) {
        orderService.cancelOrder(orderId);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Xóa đơn hàng thành công", null)
        );
    }
}
