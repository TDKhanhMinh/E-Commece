package project.back_end.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import project.back_end.request.Product.SkuRequest;
import project.back_end.response.ApiResponse;
import project.back_end.service.SkuService;

@RestController
@RequestMapping("/api/skus")
@RequiredArgsConstructor
public class SkuController {

    private final SkuService skuService;


    /**
     * Cập nhật SKU (Giá, Kho, Ảnh)
     * PUT /api/skus/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> updateSku(
            @PathVariable Long id,
            @Validated @RequestBody SkuRequest request
    ) {
        skuService.updateSku(id, request);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Cập nhật SKU thành công", null)
        );
    }

    /**
     * Xóa SKU
     * DELETE /api/skus/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteSku(@PathVariable Long id) {
        skuService.deleteSku(id);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Xóa SKU thành công", null)
        );
    }

    /**
     * Cập nhật trạng thái active/inactive của SKU
     * PATCH /api/skus/{id}/status?isActive=true
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> toggleSkuStatus(
            @PathVariable Long id,
            @RequestParam Boolean isActive
    ) {
        skuService.toggleSkuStatus(id, isActive);
        String message = isActive ? "Kích hoạt SKU thành công" : "Vô hiệu hóa SKU thành công";
        return ResponseEntity.ok(
                new ApiResponse<>(200, message, null)
        );
    }
}

