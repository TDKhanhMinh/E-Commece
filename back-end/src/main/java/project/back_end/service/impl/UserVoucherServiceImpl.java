package project.back_end.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.back_end.entity.User;
import project.back_end.entity.UserVoucher;
import project.back_end.entity.Voucher;
import project.back_end.exception.AppException;
import project.back_end.exception.ErrorCode;
import project.back_end.mapper.UserVoucherMapper;
import project.back_end.repository.UserRepository;
import project.back_end.repository.UserVoucherRepository;
import project.back_end.repository.VoucherRepository;
import project.back_end.response.UserVoucherResponse;
import project.back_end.service.UserVoucherService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserVoucherServiceImpl implements UserVoucherService {

    private final UserVoucherRepository userVoucherRepository;
    private final UserRepository userRepository;
    private final VoucherRepository voucherRepository;

    // Inject Mapper
    private final UserVoucherMapper userVoucherMapper;

    @Override
    public List<UserVoucherResponse> getAvailableVouchers(Long userId) {
        return userVoucherRepository.findByUserIdAndIsUsedFalse(userId)
                .stream()
                .map(userVoucherMapper::toResponse) // Chuyển sang Response
                .collect(Collectors.toList());
    }

    @Override
    public boolean isVoucherOwned(Long userId, Long voucherId) {
        return userVoucherRepository.findByUserIdAndVoucherId(userId, voucherId).isPresent();
    }

    // Giữ nguyên trả về Entity để dùng cho logic update nội bộ
    @Override
    public UserVoucher getUserVoucherEntity(Long userId, String voucherCode) {
        return userVoucherRepository
                .findByUserIdAndVoucherCodeAndIsUsedFalse(userId, voucherCode)
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_IN_WALLET));
    }

    @Override
    @Transactional
    public void updateUsageStatus(UserVoucher userVoucher) {
        userVoucher.setIsUsed(true);
        userVoucher.setUsedAt(LocalDateTime.now());
        userVoucherRepository.save(userVoucher);
    }

    @Override
    @Transactional
    public UserVoucherResponse assignVoucherToUser(Long userId, Long voucherId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Voucher voucher = voucherRepository.findById(voucherId)
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));

        if (isVoucherOwned(userId, voucherId)) {
            throw new AppException(ErrorCode.VOUCHER_ALREADY_OWNED);
        }

        UserVoucher userVoucher = UserVoucher.builder()
                .user(user)
                .voucher(voucher)
                .isUsed(false)
                .assignedAt(LocalDateTime.now())
                .build();

        UserVoucher savedUserVoucher = userVoucherRepository.save(userVoucher);

        // Map Entity -> Response
        return userVoucherMapper.toResponse(savedUserVoucher);
    }

    @Override
    public List<UserVoucherResponse> getAllUserVouchers() {
        return userVoucherRepository.findAll()
                .stream()
                .map(userVoucherMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserVoucherResponse> getAllVouchersByUserId(Long userId) {
        return userVoucherRepository.findByUserId(userId)
                .stream()
                .map(userVoucherMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void removeVoucherFromUser(Long userVoucherId) {
        UserVoucher userVoucher = userVoucherRepository.findById(userVoucherId)
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_IN_WALLET));

        userVoucherRepository.delete(userVoucher);
    }
}