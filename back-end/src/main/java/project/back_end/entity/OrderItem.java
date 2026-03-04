package project.back_end.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* ====================
       Relation
       ==================== */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    /* ====================
       Snapshot SKU info
       ==================== */

    @Column(nullable = false)
    private Long skuId;

    @Column(nullable = false)
    private String skuCode;

    @Column(nullable = false)
    private String productName;


    @Column(nullable = false)
    private BigDecimal price;
    
    private BigDecimal salePrice;

    private String image;

    private String sku;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private BigDecimal totalPrice;
}
