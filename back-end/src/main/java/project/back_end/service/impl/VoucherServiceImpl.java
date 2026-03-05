package project.back_end.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.back_end.entity.User;
import project.back_end.entity.UserVoucher;
import project.back_end.entity.Voucher;
import project.back_end.exception.AppException;
import project.back_end.exception.ErrorCode;
import project.back_end.mapper.UserVoucherMapper;
import project.back_end.mapper.VoucherMapper;
import project.back_end.repository.UserRepository;
import project.back_end.repository.UserVoucherRepository;
import project.back_end.repository.VoucherRepository;
import project.back_end.request.VoucherRequest.VoucherRequest;
import project.back_end.response.UserVoucherResponse;
import project.back_end.response.VoucherResponse;
import project.back_end.service.VoucherService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VoucherServiceImpl implements VoucherService {

    private final VoucherRepository voucherRepository;
    private final UserVoucherRepository userVoucherRepository;
    private final UserRepository userRepository;
    private final VoucherMapper voucherMapper;
    private final UserVoucherMapper userVoucherMapper;

    @Override
    @Transactional
    public void collectVoucher(Long userId, String voucherCode) {
        // Tìm user từ ID
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Voucher voucher = voucherRepository.findByCode(voucherCode)
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));

        // Kiểm tra xem mã này user đã thu thập chưa
        userVoucherRepository.findByUserIdAndVoucherId(userId, voucher.getId())
                .ifPresent(uv -> {
                    throw new AppException(ErrorCode.VOUCHER_ALREADY_OWNED);
                });

        UserVoucher userVoucher = UserVoucher.builder()
                .user(user)
                .voucher(voucher)
                .isUsed(false)
                .assignedAt(LocalDateTime.now())
                .build();

        userVoucherRepository.save(userVoucher);
        log.info("User {} collected voucher {}", userId, voucherCode);
    }

    @Override
    public List<UserVoucherResponse> getUserVoucherWallet(Long userId) {
        return userVoucherRepository.findByUserIdAndIsUsedFalse(userId)
                .stream()
                .map(userVoucherMapper::toResponse) // Map Entity -> Response
                .collect(Collectors.toList());
    }

    @Override
    public VoucherResponse validateVoucher(Long userId, String code, Double orderAmount) {
        Voucher voucher = voucherRepository.findByCode(code)
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(voucher.getStartDate()) || now.isAfter(voucher.getEndDate()) || !voucher.getActive()) {
            throw new AppException(ErrorCode.VOUCHER_EXPIRED);
        }

        if (orderAmount < voucher.getMinOrder()) {
            throw new AppException(ErrorCode.MIN_ORDER_NOT_MET);
        }

        userVoucherRepository.findByUserIdAndVoucherCodeAndIsUsedFalse(userId, code)
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_AVAILABLE));

        // Trả về DTO thay vì Entity
        return voucherMapper.toResponse(voucher);
    }

    @Override
    @Transactional
    public void markVoucherAsUsed(Long userId, String code) {
        UserVoucher userVoucher = userVoucherRepository
                .findByUserIdAndVoucherCodeAndIsUsedFalse(userId, code)
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));

        userVoucher.setIsUsed(true);
        userVoucher.setUsedAt(LocalDateTime.now());
        userVoucherRepository.save(userVoucher);

        // Cập nhật số lượng đã dùng trong bảng Voucher tổng
        Voucher voucher = userVoucher.getVoucher();
        voucher.setUsedCount(voucher.getUsedCount() + 1);
        voucherRepository.save(voucher);
    }


    // ================= IMPLEMENTATION CRUD =================

    @Override
    @Transactional
    public VoucherResponse createVoucher(VoucherRequest request) {
        if (voucherRepository.findByCode(request.getCode()).isPresent()) {
            throw new AppException(ErrorCode.VOUCHER_ALREADY_EXISTS);
        }

        // Map Request -> Entity
        Voucher voucher = voucherMapper.toEntity(request);
        Voucher savedVoucher = voucherRepository.save(voucher);

        // Map Entity -> Response
        return voucherMapper.toResponse(savedVoucher);
    }

    @Override
    public List<VoucherResponse> getAllVouchers() {
        return voucherRepository.findAll()
                .stream()
                .map(voucherMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public VoucherResponse getVoucherById(Long id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));
        return voucherMapper.toResponse(voucher);
    }

    @Override
    @Transactional
    public VoucherResponse updateVoucher(Long id, VoucherRequest request) {
        Voucher existingVoucher = voucherRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));

        // Tự động cập nhật các trường từ Request sang Entity có sẵn
        voucherMapper.updateVoucherFromRequest(request, existingVoucher);

        Voucher updatedVoucher = voucherRepository.save(existingVoucher);
        return voucherMapper.toResponse(updatedVoucher);
    }

    @Override
    @Transactional
    public void disableVoucher(Long id) {
        Voucher existingVoucher = voucherRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));
        existingVoucher.setActive(false);
        voucherRepository.save(existingVoucher);
    }
}