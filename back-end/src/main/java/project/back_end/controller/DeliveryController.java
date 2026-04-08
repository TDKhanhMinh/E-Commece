package project.back_end.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import project.back_end.enumerate.DeliveryStatus;
import project.back_end.enumerate.OrderStatus;
import project.back_end.response.AdminDeliveryResponse;
import project.back_end.response.ApiResponse;
import project.back_end.service.DeliveryService;

@Slf4j
@RestController
@RequestMapping("/api/delivery")
@RequiredArgsConstructor
public class DeliveryController {
    private final DeliveryService deliveryService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<AdminDeliveryResponse>>> getAllDeliveriesByAdmin(
            @RequestParam(required = false) OrderStatus status,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        DeliveryStatus deliveryStatus = deliveryService.parseStatus(status != null ? status.name() : null);
        Page<AdminDeliveryResponse> responses = deliveryService.getAllDeliveries(deliveryStatus, pageable);
        log.error("Get deliveries by admin with status: {}, page: {}, size: {}", deliveryStatus, pageable.getPageNumber(), responses.getContent().size());
        return ResponseEntity.ok(new ApiResponse<>(200, "Lấy danh sách don van thành công", responses));
    }

    @PostMapping("/{deliveryId}/accept")
    @PreAuthorize("hasRole('SHIPPER')")
    public ResponseEntity<ApiResponse<String>> acceptDelivery(
            @PathVariable Long deliveryId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String email = userDetails.getUsername();
        deliveryService.acceptDelivery(deliveryId, email);
        return ResponseEntity.ok(new ApiResponse<>(200, "Shipper đã nhận đơn hàng thành công", null));
    }
}
