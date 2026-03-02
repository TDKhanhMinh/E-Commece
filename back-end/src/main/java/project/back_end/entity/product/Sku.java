package project.back_end.entity.product;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "skus")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sku extends BaseProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnore
    private Product product;

    @Column(name = "sku_code", unique = true, nullable = false)
    private String code;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal price;

    @Column(name = "discount_percent")
    private Integer discountPercent;

    @Column(name = "sale_price", precision = 15, scale = 2)
    private BigDecimal salePrice;

    private Integer stock;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @ElementCollection
    @CollectionTable(name = "sku_images", joinColumns = @JoinColumn(name = "sku_id"))
    @Column(name = "image_url")
    private List<String> images = new ArrayList<>();

    @OneToMany(mappedBy = "sku", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SkuAttributeValue> attributeValues = new ArrayList<>();


    @Transient
    public BigDecimal getFinalPrice() {
        return salePrice != null ? salePrice : price;
    }

    @PrePersist
    @PreUpdate
    private void validate() {
        if (discountPercent != null && (discountPercent < 0 || discountPercent > 100)) {
            throw new IllegalArgumentException("Discount percent must be between 0 and 100");
        }

        if (salePrice != null && salePrice.compareTo(price) > 0) {
            throw new IllegalArgumentException("Sale price cannot be greater than original price");
        }
    }
}
