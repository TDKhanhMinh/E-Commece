package project.back_end.response.Product;

import lombok.AllArgsConstructor;
import lombok.Data;
import project.back_end.entity.product.AttributeType;

@Data
@AllArgsConstructor
public class AttributeResponse {
    private Long id;
    private String name;
    private String code;
    private AttributeType type;
}
