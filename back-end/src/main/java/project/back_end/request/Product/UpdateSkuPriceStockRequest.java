package project.back_end.request.Product;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateSkuPriceStockRequest {

    @NotNull
    @Min(0)
    private Long price;

    @NotNull
    @Min(0)
    private Integer stock;


}
