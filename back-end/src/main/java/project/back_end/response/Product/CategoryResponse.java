package project.back_end.response.Product;

import lombok.Data;

import java.util.List;

@Data
public class CategoryResponse {
    private Long id;
    private String name;
    private String slug;
    private Integer level;
    private List<CategoryResponse> children;
}