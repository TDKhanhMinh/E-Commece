package project.back_end.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import project.back_end.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    User getUserByEmail(String email);

    List<User> getAllByRole(User.Role role);

    @Query("SELECT u FROM User u WHERE " +
            "(:keyword IS NULL OR :keyword = '' OR " +
            "LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.phone) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<User> searchUsers(@Param("keyword") String keyword, Pageable pageable);

    /**
     * Lấy danh sách người dùng theo hạng thành viên (phân trang)
     * Thường dùng cho Admin để lọc khách hàng thân thiết
     */
    Page<User> findByMembershipTier(String membershipTier, Pageable pageable);

    /**
     * Lấy bảng xếp hạng người dùng dựa trên tổng điểm tích lũy trọn đời
     * Thường dùng để vinh danh khách hàng VIP
     */
    Page<User> findAllByOrderByTotalAccumulatedPointsDesc(Pageable pageable);

}
