package project.back_end.request.Product;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class SkuRequest {

    @NotBlank(message = "SKU code must not be blank")
    @Size(max = 100, message = "SKU code must not exceed 100 characters")
    private String skuCode;

    @NotNull(message = "Price must not be null")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "Stock must not be null")
    @Min(value = 0, message = "Stock must be greater than or equal to 0")
    private Integer stock;

    @Size(max = 10, message = "Maximum 10 images are allowed")
    private List<
            @NotBlank(message = "Image URL must not be blank")
                    String
            > images;

    @Valid
    private List<SkuAttributeRequest> attributes;
}
