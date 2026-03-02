package project.back_end.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "order_delivery_addresses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDeliveryAddress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String location;
    private String userName;
    private String phoneNumber;
}
