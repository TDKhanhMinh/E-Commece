package project.back_end.request.Product;

import lombok.Data;

import java.util.List;

@Data
public class AttributeGenerateRequest {
    private Long attributeId;
    private List<String> values;
}
