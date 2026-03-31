package project.back_end.service.impl;


import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.back_end.entity.MemberShipPointHistory;
import project.back_end.entity.PointTransactionType;
import project.back_end.entity.User;
import project.back_end.exception.AppException;
import project.back_end.exception.ErrorCode;
import project.back_end.mapper.PointMapper;
import project.back_end.repository.PointHistoryRepository;
import project.back_end.repository.UserRepository;
import project.back_end.response.MemberShipPointHistoryResponse;
import project.back_end.response.UserPointSummaryResponse;
import project.back_end.service.MemberShipPointService;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MemberShipPointServiceImpl implements MemberShipPointService {

    private final UserRepository userRepository;
    private final PointHistoryRepository pointHistoryRepository;
    private final PointMapper pointMapper;

    @Override
    @Transactional
    public void managePoints(Long userId, Long amount, PointTransactionType type, Long referenceId, String description) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Long currentPoints = user.getCurrentPoints() != null ? user.getCurrentPoints() : 0L;
        Long newCurrentBalance = currentPoints + amount;

        if (newCurrentBalance < 0) {
            throw new AppException(ErrorCode.INSUFFICIENT_POINTS);
        }
        user.setCurrentPoints(newCurrentBalance);

        if (type == PointTransactionType.EARN && amount > 0) {
            Long totalAcc = user.getTotalAccumulatedPoints() != null ? user.getTotalAccumulatedPoints() : 0L;
            Long newTotalAcc = totalAcc + amount;
            user.setTotalAccumulatedPoints(newTotalAcc);
            user.setMembershipTier(determineTier(newTotalAcc));
        }

        userRepository.save(user);

        MemberShipPointHistory history = MemberShipPointHistory.builder()
                .user(user)
                .pointDelta(amount)
                .balanceAfter(newCurrentBalance)
                .type(type)
                .referenceId(referenceId)
                .description(description)
                .createdAt(LocalDateTime.now())
                .build();

        pointHistoryRepository.save(history);
    }

    @Override
    public Page<MemberShipPointHistoryResponse> getPointHistory(Long userId, Pageable pageable) {
        Page<MemberShipPointHistory> entities = pointHistoryRepository.findByUserId(userId, pageable);

        return entities.map(pointMapper::toHistoryResponse);
    }

    @Override
    public UserPointSummaryResponse getUserPointInfo(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return pointMapper.toSummaryResponse(user);
    }

    @Override
    @Transactional
    public void redeemPoints(Long userId, Long amount, Long referenceId, String description) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // 1. Kiểm tra số dư điểm hiện tại
        long currentPoints = user.getCurrentPoints() != null ? user.getCurrentPoints() : 0L;

        // Đảm bảo amount truyền vào là số dương để logic trừ điểm chuẩn xác
        long pointsToRedeem = Math.abs(amount);

        if (currentPoints < pointsToRedeem) {
            throw new AppException(ErrorCode.INSUFFICIENT_POINTS); // Lỗi không đủ điểm
        }

        // 2. Thực hiện trừ điểm
        Long newBalance = currentPoints - pointsToRedeem;
        user.setCurrentPoints(newBalance);

        // Lưu ý: Chúng ta KHÔNG trừ vào totalAccumulatedPoints vì đó là điểm xét hạng
        userRepository.save(user);

        // 3. Ghi nhật ký với type là REDEEM
        MemberShipPointHistory history = MemberShipPointHistory.builder()
                .user(user)
                .pointDelta(-pointsToRedeem) // Lưu số âm để dễ nhận biết là trừ điểm
                .balanceAfter(newBalance)
                .type(PointTransactionType.REDEEM)
                .referenceId(referenceId)
                .description(description)
                .createdAt(LocalDateTime.now())
                .build();

        pointHistoryRepository.save(history);
    }

    /**
     * Logic xét hạng thành viên
     * Tùy chỉnh các mốc điểm phù hợp với dự án của bạn
     */
    private String determineTier(Long totalPoints) {
        if (totalPoints >= 150000) return "DIAMOND";
        if (totalPoints >= 100000) return "PLATINUM";
        if (totalPoints >= 50000) return "GOLD";
        if (totalPoints >= 20000) return "SILVER";
        return "MEMBER";
    }
}