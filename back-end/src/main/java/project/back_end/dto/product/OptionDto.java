package project.back_end.response.Product;

import lombok.Data;

import java.util.Set;

@Data
public class OptionDto {
    private String code;
    private String name;
    private Set<String> values;
}
