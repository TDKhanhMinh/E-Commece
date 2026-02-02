package project.back_end.entity.product;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Table(name = "brands")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Brand extends BaseProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    
    private Long id;
    private String name;

    @Column(unique = true)
    private String slug;

    private String logo;

    @Column(columnDefinition = "TEXT")
    private String description;
}
