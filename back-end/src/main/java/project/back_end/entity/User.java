package project.back_end.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "phone")
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Role role;

    @Column(name = "isActive")
    private Boolean isActive = true;

    @Column(name = "avatarUrl")
    private String avatarUrl;

    @Column(name = "createdAt", updatable = false)
    private LocalDateTime createdAt;


    public enum Role {
        USER, ADMIN
    }

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DeliveryAddress> addresses = new ArrayList<>();
}