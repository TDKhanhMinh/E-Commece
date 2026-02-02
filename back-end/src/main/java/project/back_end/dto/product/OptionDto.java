package project.back_end.dto.product;

import lombok.Data;

import java.util.Set;

@Data
public class OptionDto {
    private String code;
    private String name;
    private Set<String> values;
}
