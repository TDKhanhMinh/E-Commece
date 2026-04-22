package project.back_end.response.Product;

import lombok.Data;
import project.back_end.dto.product.OptionDto;
import project.back_end.dto.product.SkuDto;
import project.back_end.dto.product.SpecDto;

import java.util.ArrayList;
import java.util.List;

@Data
public class ProductDetailResponse {
    private Long id;
    private String name;
    private String description;
    private Long categoryId;
    private Long brandId;

    private List<String> images = new ArrayList<>();

    private List<SpecDto> specifications;

    private List<OptionDto> configurableOptions;

    private List<SkuDto> variants;
}

