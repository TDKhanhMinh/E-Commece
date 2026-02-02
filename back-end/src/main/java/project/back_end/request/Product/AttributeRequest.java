package project.back_end.request.Product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import project.back_end.entity.product.AttributeType;

@Data
public class AttributeRequest {
    @NotBlank(message = "Tên thuộc tính không được để trống")
    private String name;

    @NotBlank(message = "Mã thuộc tính không được để trống")
    private String code;

    @NotNull(message = "Loại thuộc tính không được để trống")
    private AttributeType type; // Enum: TEXT, SELECT, NUMBER
}
