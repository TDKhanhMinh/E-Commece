package project.back_end.dto.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SpecDto {
    private Long attributeId;
    private String attributeName;
    private String value;
}
