package project.back_end.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.back_end.entity.MemberShipPointHistory;

@Repository
public interface PointHistoryRepository extends JpaRepository<MemberShipPointHistory, Long> {

    /**
     * Lấy lịch sử điểm của một người dùng có phân trang
     *
     * @param userId   ID của người dùng
     * @param pageable Đối tượng phân trang (chứa page, size, sort)
     * @return Trang danh sách lịch sử điểm
     */
    Page<MemberShipPointHistory> findByUserId(Long userId, Pageable pageable);
}