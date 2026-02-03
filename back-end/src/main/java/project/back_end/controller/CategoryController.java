package project.back_end.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import project.back_end.request.Product.CategoryRequest;
import project.back_end.response.ApiResponse;
import project.back_end.response.Product.CategoryResponse;
import project.back_end.service.CategoryService;

@Slf4j
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // ================== PUBLIC ENDPOINTS ==================

    /**
     * Lấy cây danh mục (Category Tree) với phân trang và tìm kiếm
     * GET /api/categories
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<CategoryResponse>>> getAllCategories(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDirection) {

        Sort.Direction direction = sortDirection.equalsIgnoreCase("DESC")
                ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<CategoryResponse> categories = categoryService.getAllCategories(keyword, pageable);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Lấy danh sách danh mục thành công", categories)
        );
    }

    /**
     * Lấy chi tiết một danh mục
     * GET /api/categories/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable Long id) {
        CategoryResponse category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Lấy chi tiết danh mục thành công", category)
        );
    }

    // ================== PROTECTED ENDPOINTS  ==================

    /**
     * Tạo danh mục mới
     * POST /api/categories
     * Yêu cầu: Role ADMIN
     */
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            @Valid @RequestBody CategoryRequest request
    ) {
        CategoryResponse newCategory = categoryService.createCategory(request);
        log.info("Created new category: {}", newCategory);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Tạo danh mục thành công", newCategory)
        );
    }

    /**
     * Cập nhật danh mục
     * PUT /api/categories/{id}
     * Yêu cầu: Role ADMIN
     */
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request
    ) {
        CategoryResponse updatedCategory = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Cập nhật danh mục thành công", updatedCategory)
        );
    }

    /**
     * Xóa danh mục
     * DELETE /api/categories/{id}
     * Yêu cầu: Role ADMIN
     */
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Xóa danh mục thành công", null)
        );
    }
}