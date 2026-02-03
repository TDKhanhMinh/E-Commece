package project.back_end.request.Product;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;


@Data
public class UpdateSkuRequest {

    @NotNull
    @Min(0)
    private BigDecimal price;

    @Min(0)
    @Max(100)
    private Integer discountPercent;

    // Tồn kho
    @NotNull
    @Min(0)
    private Integer stock;

    private List<String> images = new ArrayList<>();
}
