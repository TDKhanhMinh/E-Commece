package project.back_end.dto.product;

import lombok.Data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Data
public class SkuDto {
    private Long id;
    private String skuCode;
    private BigDecimal price;
    private Integer stock;
    private String image;
    private List<String> imagesDetails = new ArrayList<>();
    private BigDecimal salePrice;
    private BigDecimal finalPrice;

    private Integer discountPercent;
    private Map<String, String> attributes;
}
