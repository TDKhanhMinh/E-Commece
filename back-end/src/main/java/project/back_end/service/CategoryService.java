package project.back_end.service;


import org.springframework.stereotype.Service;
import project.back_end.request.Product.CategoryRequest;
import project.back_end.response.Product.CategoryResponse;

import java.util.List;

@Service
public interface CategoryService {

    // Tạo mới danh mục
    CategoryResponse createCategory(CategoryRequest request);

    // Lấy chi tiết một danh mục
    CategoryResponse getCategoryById(Long id);

    // Lấy toàn bộ danh mục theo dạng cây (Tree Structure) - Chỉ lấy danh mục gốc
    List<CategoryResponse> getAllCategories();

    // Cập nhật danh mục
    CategoryResponse updateCategory(Long id, CategoryRequest request);

    // Xóa danh mục
    void deleteCategory(Long id);
}