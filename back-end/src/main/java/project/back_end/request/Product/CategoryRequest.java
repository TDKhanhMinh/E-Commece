package project.back_end.request.Product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class CategoryRequest {

    @NotBlank(message = "Category name must not be blank")
    @Size(max = 255, message = "Category name must not exceed 255 characters")
    private String name;

    private Long parentId;

    private List<Long> attributeIds;
}
