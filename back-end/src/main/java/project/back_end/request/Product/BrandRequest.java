package project.back_end.request.Product;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BrandRequest {
    @NotBlank(message = "Tên thương hiệu không được để trống")
    private String name;
    private String description;
    private String logo;
}
