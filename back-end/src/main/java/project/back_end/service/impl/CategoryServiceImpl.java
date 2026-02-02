package project.back_end.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.back_end.entity.product.Attribute;
import project.back_end.entity.product.Category;
import project.back_end.entity.product.CategoryAttribute;
import project.back_end.mapper.CategoryMapper;
import project.back_end.repository.AttributeRepository;
import project.back_end.repository.CategoryAttributeRepository;
import project.back_end.repository.CategoryRepository;
import project.back_end.request.Product.CategoryRequest;
import project.back_end.response.Product.CategoryResponse;
import project.back_end.service.CategoryService;

import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static project.back_end.service.impl.ProductServiceImpl.getString;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final AttributeRepository attributeRepository;
    private final CategoryAttributeRepository categoryAttributeRepository;
    private final CategoryMapper categoryMapper;

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        Category category = new Category();
        category.setName(request.getName());
        category.setSlug(toSlug(request.getName()));

        if (request.getParentId() != null) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Danh mục cha không tồn tại"));
            category.setParent(parent);
        }

        Category savedCategory = categoryRepository.save(category);

        if (request.getAttributeIds() != null && !request.getAttributeIds().isEmpty()) {
            List<Attribute> attributes = attributeRepository.findAllById(request.getAttributeIds());

            List<CategoryAttribute> categoryAttributes = attributes.stream().map(attr -> {
                CategoryAttribute catAttr = new CategoryAttribute();
                catAttr.setCategory(savedCategory);
                catAttr.setAttribute(attr);
                catAttr.setIsVariant(true);
                return catAttr;
            }).collect(Collectors.toList());

            categoryAttributeRepository.saveAll(categoryAttributes);
        }

        return categoryMapper.toResponse(savedCategory);
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));
        return categoryMapper.toResponse(category);
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        List<Category> rootCategories =
                categoryRepository.findByParentIsNull();

        return rootCategories.stream()
                .map(categoryMapper::toResponse)
                .toList();
    }


    @Override
    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));

        category.setName(request.getName());
        category.setSlug(toSlug(request.getName()));

        if (request.getParentId() != null) {
            if (request.getParentId().equals(id)) {
                throw new RuntimeException("Không thể chọn chính mình làm danh mục cha");
            }
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Danh mục cha không tồn tại"));
            category.setParent(parent);
        } else {
            category.setParent(null);
        }

        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Danh mục không tồn tại");
        }
        categoryRepository.deleteById(id);
    }

    // ================= HELPER METHODS =================

    /**
     * Hàm Map Entity sang DTO (Có đệ quy để lấy cây thư mục con)
     */
    private CategoryResponse mapToResponse(Category category) {
        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setSlug(category.getSlug());

        int level = 0;
        Category current = category;
        while (current.getParent() != null) {
            level++;
            current = current.getParent();
        }
        response.setLevel(level);

        if (category.getChildren() != null && !category.getChildren().isEmpty()) {
            List<CategoryResponse> childrenDtos = category.getChildren().stream()
                    .map(categoryMapper::toResponse)
                    .collect(Collectors.toList());
            response.setChildren(childrenDtos);
        }

        return response;
    }

    /**
     * Hàm tạo Slug từ tiếng Việt (Ví dụ: "Điện Thoại" -> "dien-thoai")
     */
    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    private String toSlug(String input) {
        return getString(input, WHITESPACE, NONLATIN);
    }
}