package project.back_end.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import project.back_end.request.Product.AutoGenerateSkuRequest;
import project.back_end.request.Product.ProductRequest;
import project.back_end.request.Product.SkuRequest;
import project.back_end.request.Product.UpdateSkuPriceStockRequest;
import project.back_end.response.ApiResponse;
import project.back_end.response.Product.ProductDetailResponse;
import project.back_end.response.Product.ProductListResponse;
import project.back_end.service.ProductService;
import project.back_end.service.SkuService;

@Slf4j
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final SkuService skuService;

    // ================== PUBLIC ENDPOINTS  ==================

    /**
     * Lấy danh sách sản phẩm (Có tìm kiếm, lọc và phân trang)
     * GET /api/products?page=0&size=10&keyword=iphone&categoryId=1
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProductListResponse>>> getAllProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long brandId,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<ProductListResponse> products = productService.getAllProducts(keyword, categoryId, brandId, pageable);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Lấy danh sách sản phẩm thành công", products)
        );
    }

    /**
     * Lấy chi tiết sản phẩm (Bao gồm Specs và SKUs)
     * GET /api/products/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDetailResponse>> getProductById(@PathVariable Long id) {
        ProductDetailResponse product = productService.getProductById(id);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Lấy chi tiết sản phẩm thành công", product)
        );
    }

    // ================== PROTECTED ENDPOINTS (Chỉ ADMIN) ==================

    /**
     * Tạo sản phẩm mới (SPU + Specs)
     * POST /api/products
     */
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<ProductDetailResponse>> createProduct(
            @Valid @RequestBody ProductRequest request
    ) {
        log.info("Received create product request: {}", request);
        ProductDetailResponse newProduct = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(200, "Tạo sản phẩm thành công", newProduct)
        );
    }

    /**
     * Cập nhật thông tin chung sản phẩm (Tên, Mô tả, Specs)
     * PUT /api/products/{id}
     */
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDetailResponse>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request
    ) {
        ProductDetailResponse updatedProduct = productService.updateProduct(id, request);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Cập nhật sản phẩm thành công", updatedProduct)
        );
    }

    /**
     * Xóa sản phẩm (Xóa luôn cả SKU liên quan)
     * DELETE /api/products/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Xóa sản phẩm thành công", null)
        );
    }

    // --- SKU MANAGEMENT (Nested Resource) ---

    /**
     * Thêm SKU mới cho sản phẩm
     * POST /api/products/{productId}/skus
     */
    @PostMapping("/{productId}/skus")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> createSku(
            @PathVariable Long productId,
            @Validated @RequestBody SkuRequest request
    ) {
        log.info("Received create SKU request for product {}: {}", productId, request);
        skuService.createSku(productId, request);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Thêm biến thể SKU thành công", null)
        );
    }

    @PostMapping("/{productId}/auto-generate")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> autoGenerateSku(
            @PathVariable Long productId,
            @Validated @RequestBody AutoGenerateSkuRequest request
    ) {
        skuService.autoGenerateSku(productId, request);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Auto-generate SKU thành công", null)
        );
    }

    @PutMapping("/{productId}/sku/{skuId}")
    public ResponseEntity<ApiResponse<Void>> updateSkuPriceAndStock(
            @PathVariable Long productId,
            @PathVariable Long skuId,
            @RequestBody @Valid UpdateSkuPriceStockRequest request
    ) {
        skuService.updateSkuPriceAndStock(productId, skuId, request);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Cập nhật giá và tồn kho SKU thành công", null)
        );
    }
}