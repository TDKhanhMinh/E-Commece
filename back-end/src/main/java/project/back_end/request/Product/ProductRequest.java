package project.back_end.request.Product;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ProductRequest {

    @NotBlank(message = "Product name must not be blank")
    @Size(max = 255, message = "Product name must not exceed 255 characters")
    private String name;

    @NotNull(message = "Category ID must not be null")
    private Long categoryId;

    @NotNull(message = "Brand ID must not be null")
    private Long brandId;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    private List<String> images = new ArrayList<>();

    @Valid
    private List<SpecRequest> specs;
}
