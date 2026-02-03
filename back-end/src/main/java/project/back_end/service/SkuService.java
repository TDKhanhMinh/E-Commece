package project.back_end.service;


import project.back_end.request.Product.AutoGenerateSkuRequest;
import project.back_end.request.Product.SkuRequest;
import project.back_end.request.Product.UpdateSkuRequest;

import java.util.List;

public interface SkuService {
    // Thêm SKU mới vào Product
    void createSku(Long productId, SkuRequest request);

    // Thêm nhiều SKU cùng lúc (Bulk create)
    void createSkus(Long productId, List<SkuRequest> requests);

    // Cập nhật SKU (Giá, Tồn kho, Ảnh)
    void updateSku(Long skuId, SkuRequest request);

    // Xóa SKU
    void deleteSku(Long skuId);

    // Tự động tạo SKU dựa trên thuộc tính sản phẩm
    void autoGenerateSku(Long productId, AutoGenerateSkuRequest request);

    // Cập nhật giá và tồn kho của SKU
    void updateSkuDetails(
            Long productId,
            Long skuId,
            UpdateSkuRequest request
    );
}