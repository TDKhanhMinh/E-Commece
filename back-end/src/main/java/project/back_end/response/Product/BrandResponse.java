package project.back_end.response.Product;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BrandResponse {
    private Long id;
    private String name;
    private String slug;
    private String logo;
    private String description;
}