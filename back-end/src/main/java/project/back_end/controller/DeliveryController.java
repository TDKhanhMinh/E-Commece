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
import project.back_end.response.ShipperDeliveryResponse;
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

    @GetMapping("/unassigned")
    @PreAuthorize("hasRole('SHIPPER')")
    public ResponseEntity<ApiResponse<Page<ShipperDeliveryResponse>>> getDeliveriesForShipper(
            @AuthenticationPrincipal UserDetails userDetails,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        String email = userDetails.getUsername();
        Page<ShipperDeliveryResponse> deliveries = deliveryService.getDeliveriesByShipper(pageable);
        log.error("Get deliveries for shipper: {}, page: {}, size: {}", email, pageable.getPageNumber(), deliveries.getContent().size());
        return ResponseEntity.ok(new ApiResponse<>(200, "Lấy danh sách đơn hàng thành công", deliveries));
    }

    @GetMapping("/status")
    @PreAuthorize("hasRole('SHIPPER')")
    public ResponseEntity<ApiResponse<Page<ShipperDeliveryResponse>>> getDeliveriesByStatusForShipper(
            @RequestParam String status,
            @AuthenticationPrincipal UserDetails userDetails,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        String email = userDetails.getUsername();
        Page<ShipperDeliveryResponse> deliveries = deliveryService.getAllDeliveryByStatus(status, email, pageable);
        log.error("Get deliveries by status: {}, for shipper: {}, page: {}, size: {}", status, email, pageable.getPageNumber(), deliveries.getContent().size());
        return ResponseEntity.ok(new ApiResponse<>(200, "Lấy danh sách đơn hàng thành công", deliveries));
    }

    @GetMapping("/{deliveryId}")
    @PreAuthorize("hasRole('SHIPPER')")
    public ResponseEntity<ApiResponse<ShipperDeliveryResponse>> getDeliveryByIdForShipper(
            @PathVariable Long deliveryId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String email = userDetails.getUsername();
        ShipperDeliveryResponse response = deliveryService.getDeliveryById(deliveryId);
        log.error("Get delivery by id: {}, for shipper: {}", deliveryId, email);
        return ResponseEntity.ok(new ApiResponse<>(200, "Lấy thông tin chi tiết đơn hàng thành công", response));
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

    @PostMapping("/{deliveryId}/delivery")
    @PreAuthorize("hasRole('SHIPPER')")
    public ResponseEntity<ApiResponse<String>> pickupDelivery(
            @PathVariable Long deliveryId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String email = userDetails.getUsername();
        deliveryService.updateDeliveryStatus(deliveryId, "DELIVERING", null, email);
        return ResponseEntity.ok(new ApiResponse<>(200, "Shipper đã lấy hàng thành công ", null));
    }

    @PostMapping("/{deliveryId}/cancel")
    @PreAuthorize("hasRole('SHIPPER')")
    public ResponseEntity<ApiResponse<String>> cancelDelivery(
            @PathVariable Long deliveryId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String email = userDetails.getUsername();
        deliveryService.updateDeliveryStatus(deliveryId, "CANCELED", null, email);
        return ResponseEntity.ok(new ApiResponse<>(200, "Shipper đã hủy đơn hàng thành công", null));
    }


    @PostMapping("/{deliveryId}/success")
    @PreAuthorize("hasRole('SHIPPER')")
    public ResponseEntity<ApiResponse<String>> markDeliveryAsSuccess(
            @PathVariable Long deliveryId,
            @RequestBody String proofImage,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String email = userDetails.getUsername();
        log.error("Shipper cập nhật trạng thái đơn hàng thành công, deliveryId: {}, proofImage: {}", deliveryId, proofImage);
        deliveryService.updateDeliveryStatus(deliveryId, "SUCCESS", proofImage, email);
        return ResponseEntity.ok(new ApiResponse<>(200, "Shipper đã cập nhật trạng thái đơn hàng thành công", null));
    }

}
