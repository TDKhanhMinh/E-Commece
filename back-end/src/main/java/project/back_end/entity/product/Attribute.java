package project.back_end.entity.product;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import project.back_end.enumerate.AttributeType;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "attributes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Attribute extends BaseProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;
    private String name;

    @Column(unique = true)
    private String code;

    @Enumerated(EnumType.STRING)
    private AttributeType type;
}
