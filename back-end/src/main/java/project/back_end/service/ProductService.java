package project.back_end.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import project.back_end.request.Product.ProductRequest;
import project.back_end.response.Product.ProductDetailResponse;
import project.back_end.response.Product.ProductListResponse;

@Service
public interface ProductService {
    // Lấy sản phẩm theo slug (Public – FE / SEO)
    ProductDetailResponse getProductBySlug(String slug);

    // Tạo sản phẩm mới kèm thông số specs
    ProductDetailResponse createProduct(ProductRequest request);

    // Cập nhật sản phẩm
    ProductDetailResponse updateProduct(Long id, ProductRequest request);

    // Lấy chi tiết (Gồm cả SKUs và Specs)
    ProductDetailResponse getProductById(Long id);

    // Lấy danh sách (Phân trang, tìm kiếm)
    Page<ProductListResponse> getAllProducts(String keyword, Long categoryId, Long brandId, Pageable pageable);

    // Xóa mềm hoặc xóa cứng
    void deleteProduct(Long id);
}
