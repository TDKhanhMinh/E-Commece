package project.back_end.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.back_end.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    User getUserByEmail(String email);
}
