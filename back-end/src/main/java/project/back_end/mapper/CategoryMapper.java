package project.back_end.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import project.back_end.entity.product.Category;
import project.back_end.response.Product.CategoryResponse;

import java.util.Collections;
import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(target = "level", expression = "java(calculateLevel(category))")
    @Mapping(target = "children", expression = "java(mapChildren(category))")
    CategoryResponse toResponse(Category category);

    // ===== Custom methods =====

    default int calculateLevel(Category category) {
        int level = 0;
        Category current = category;
        while (current.getParent() != null) {
            level++;
            current = current.getParent();
        }
        return level;
    }

    default List<CategoryResponse> mapChildren(Category category) {
        if (category.getChildren() == null || category.getChildren().isEmpty()) {
            return Collections.emptyList();
        }
        return category.getChildren()
                .stream()
                .map(this::toResponse) // Đệ quy an toàn
                .toList();
    }
}

