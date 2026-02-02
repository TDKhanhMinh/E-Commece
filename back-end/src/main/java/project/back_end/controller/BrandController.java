package project.back_end.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import project.back_end.request.Product.BrandRequest;
import project.back_end.response.ApiResponse;
import project.back_end.response.Product.BrandResponse;
import project.back_end.service.BrandService;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
@RequiredArgsConstructor
public class BrandController {

    private final BrandService brandService;

    // Public: Xem danh sách
    @GetMapping
    public ResponseEntity<ApiResponse<List<BrandResponse>>> getAllBrands() {
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", brandService.getAllBrands()));
    }

    // Public: Xem chi tiết
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BrandResponse>> getBrandById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", brandService.getBrandById(id)));
    }

    // Admin: Tạo mới
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<BrandResponse>> createBrand(@Valid @RequestBody BrandRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(200, "Brand created", brandService.createBrand(request)));
    }

    // Admin: Cập nhật
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<BrandResponse>> updateBrand(@PathVariable Long id, @Valid @RequestBody BrandRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(200, "Brand updated", brandService.updateBrand(id, request)));
    }

    // Admin: Xóa
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteBrand(@PathVariable Long id) {
        brandService.deleteBrand(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "Brand deleted", null));
    }
}
