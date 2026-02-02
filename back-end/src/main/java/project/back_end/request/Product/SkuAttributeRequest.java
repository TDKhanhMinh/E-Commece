package project.back_end.request.Product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SkuAttributeRequest {

    @NotNull(message = "Attribute ID must not be null")
    private Long attributeId;

    @NotBlank(message = "Attribute value must not be blank")
    private String value;
}
