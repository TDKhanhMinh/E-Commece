package project.back_end.service.impl;

import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.back_end.entity.ShipperProfile;
import project.back_end.entity.User;
import project.back_end.entity.WalletTransaction;
import project.back_end.enumerate.ErrorCode;
import project.back_end.enumerate.TransactionAction;
import project.back_end.enumerate.TransactionStatus;
import project.back_end.enumerate.TransactionType;
import project.back_end.event.WalletTransactionEvent;
import project.back_end.exception.AppException;
import project.back_end.mapper.WalletMapper;
import project.back_end.repository.ShipperProfileRepository;
import project.back_end.repository.UserRepository;
import project.back_end.repository.WalletTransactionRepository;
import project.back_end.request.WithdrawRequest;
import project.back_end.response.BalanceAndRevenueResponse;
import project.back_end.response.WalletTransactionResponse;
import project.back_end.response.WithdrawResponse;
import project.back_end.service.WalletService;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class WalletServiceImpl implements WalletService {
    private static final Logger log = LoggerFactory.getLogger(WalletServiceImpl.class);
    private final ApplicationEventPublisher eventPublisher;
    private final WalletTransactionRepository repository;
    private final UserRepository userRepository;
    private final WalletMapper walletMapper;
    private final ShipperProfileRepository shipperProfileRepository;

    @Override
    public void addDeliveryFee(String email, BigDecimal fee, Long orderId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        ShipperProfile shipperProfile = user.getShipperProfile();
        if (shipperProfile == null) {
            throw new AppException(ErrorCode.SHIPPER_PROFILE_NOT_FOUND);
        }
        List<WalletTransaction> shipperTransactions = shipperProfile.getWalletTransactions();

        // Tạo một giao dịch mới cho shipper
        WalletTransaction transaction = new WalletTransaction();
        transaction.setShipperProfile(shipperProfile);
        transaction.setAmount(fee);
        transaction.setStatus(TransactionStatus.SUCCESS);
        transaction.setAction(TransactionAction.DELIVERY_FEE);
        transaction.setType(TransactionType.CREDIT);
        transaction.setReferenceId(orderId);
        transaction.setDescription("Nhận cước giao hàng từ đơn hàng #" + orderId);
        shipperTransactions.add(transaction);
        repository.save(transaction);

        shipperProfile.setBalance(shipperProfile.getBalance().add(fee));
        shipperProfile.setWalletTransactions(shipperTransactions);
        shipperProfileRepository.save(shipperProfile);

        // Phát sự kiện để cập nhật ví của shipper
        eventPublisher.publishEvent(new WalletTransactionEvent(transaction, user.getDeviceToken()));
    }

    @Override
    public Page<WalletTransactionResponse> getAllTransactions(String status, Pageable pageable, String type,
            String action, String startDate, String endDate) {
        // Parse status
        TransactionStatus transactionStatus = null;
        if (status != null && !status.equalsIgnoreCase("ALL") && !status.equalsIgnoreCase("null")) {
            try {
                transactionStatus = TransactionStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new AppException(ErrorCode.INVALID_TRANSACTION_STATUS);
            }
        }

        // Parse type
        TransactionType transactionType = null;
        if (type != null && !type.isEmpty() && !type.equalsIgnoreCase("null")) {
            try {
                transactionType = TransactionType.valueOf(type.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }
        }

        // Parse action
        TransactionAction transactionAction = null;
        if (action != null && !action.isEmpty() && !action.equalsIgnoreCase("null")) {
            try {
                transactionAction = TransactionAction.valueOf(action.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }
        }

        // Parse dates
        LocalDateTime createdAtAfter = null;
        LocalDateTime createdAtBefore = null;
        if (startDate != null && !startDate.isEmpty() && !startDate.equalsIgnoreCase("null")) {
            try {
                if (startDate.contains("T")) {
                    createdAtAfter = LocalDateTime.parse(startDate);
                } else {
                    createdAtAfter = java.time.LocalDate.parse(startDate).atStartOfDay();
                }
            } catch (Exception e) {
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }
        }
        if (endDate != null && !endDate.isEmpty() && !endDate.equalsIgnoreCase("null")) {
            try {
                if (endDate.contains("T")) {
                    createdAtBefore = LocalDateTime.parse(endDate);
                } else {
                    createdAtBefore = java.time.LocalDate.parse(endDate).atTime(23, 59, 59);
                }
            } catch (Exception e) {
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }
        }

        return repository.filterWalletTransactions(
                transactionStatus, transactionType, transactionAction,
                createdAtAfter, createdAtBefore, pageable)
                .map(walletMapper::toWalletTransactionResponse);
    }

    @Override
    public BalanceAndRevenueResponse getShipperBalanceAndRevenue(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        ShipperProfile shipperProfile = user.getShipperProfile();
        if (shipperProfile == null) {
            throw new AppException(ErrorCode.SHIPPER_PROFILE_NOT_FOUND);
        }
        List<WalletTransaction> transactionsInCurrentMonth = repository
                .findAllByShipperProfileAndActionAndStatusAndTypeAndCreatedAtBetween(
                        shipperProfile,
                        TransactionAction.DELIVERY_FEE,
                        TransactionStatus.SUCCESS,
                        TransactionType.CREDIT,
                        java.time.LocalDate.now().withDayOfMonth(1).atStartOfDay(),
                        java.time.LocalDate.now().plusDays(1).atStartOfDay());
        log.error("Transactions in current month: {}", transactionsInCurrentMonth.size());
        List<WalletTransaction> transactionsInCurrentDay = repository
                .findAllByShipperProfileAndActionAndStatusAndTypeAndCreatedAtBetween(
                        shipperProfile,
                        TransactionAction.DELIVERY_FEE,
                        TransactionStatus.SUCCESS,
                        TransactionType.CREDIT,
                        java.time.LocalDate.now().atStartOfDay(),
                        java.time.LocalDate.now().plusDays(1).atStartOfDay());
        WalletServiceImpl.log.error("Transactions in current day: {}", transactionsInCurrentDay.size());

        BigDecimal revenueInCurrentMonth = transactionsInCurrentMonth.stream()
                .map(WalletTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal revenueInCurrentDay = transactionsInCurrentDay.stream()
                .map(WalletTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return walletMapper.toBalanceAndRevenueResponse(shipperProfile.getBalance(), revenueInCurrentMonth,
                revenueInCurrentDay);
    }

    @Override
    public Page<WalletTransactionResponse> getShipperHistoryTransactions(String email, Pageable pageable) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        ShipperProfile shipperProfile = user.getShipperProfile();
        if (shipperProfile == null) {
            throw new AppException(ErrorCode.SHIPPER_PROFILE_NOT_FOUND);
        }
        return repository
                .getWalletTransactionsByShipperProfile(shipperProfile, pageable)
                .map(walletMapper::toWalletTransactionResponse);
    }

    @Override
    @Transactional
    public void updateTransactionStatus(Long transactionId, String status) {
        WalletTransaction transaction = repository.findById(transactionId)
                .orElseThrow(() -> new AppException(ErrorCode.TRANSACTION_NOT_FOUND));

        TransactionStatus oldStatus = transaction.getStatus();
        TransactionStatus newStatus;
        try {
            newStatus = TransactionStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_TRANSACTION_STATUS);
        }

        if (oldStatus == newStatus) {
            return;
        }

        transaction.setStatus(newStatus);
        repository.save(transaction);

        if (oldStatus == TransactionStatus.PENDING && newStatus == TransactionStatus.SUCCESS) {
            ShipperProfile shipperProfile = transaction.getShipperProfile();
            if (shipperProfile != null) {
                if (transaction.getType() == TransactionType.CREDIT) {
                    shipperProfile.setBalance(shipperProfile.getBalance().add(transaction.getAmount()));
                } else if (transaction.getType() == TransactionType.DEBIT) {
                }
                shipperProfileRepository.save(shipperProfile);

                transaction.setBalanceAfter(shipperProfile.getBalance());
                repository.save(transaction);
            }
        }

        if (oldStatus == TransactionStatus.PENDING
                && (newStatus == TransactionStatus.REJECTED || newStatus == TransactionStatus.FAILED)) {
            ShipperProfile shipperProfile = transaction.getShipperProfile();
            if (shipperProfile != null && transaction.getType() == TransactionType.DEBIT) {
                shipperProfile.setBalance(shipperProfile.getBalance().add(transaction.getAmount()));
                shipperProfileRepository.save(shipperProfile);

                transaction.setBalanceAfter(shipperProfile.getBalance());
                repository.save(transaction);
                log.info("Refunded {} to shipper {} due to {} withdrawal",
                        transaction.getAmount(), shipperProfile.getUserId(), newStatus);
            }
        }

        log.info("Transaction {} status updated from {} to {}", transactionId, oldStatus, newStatus);
    }

    @Override
    @Transactional
    public WithdrawResponse requestWithdrawal(String email, WithdrawRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        ShipperProfile shipperProfile = user.getShipperProfile();
        if (shipperProfile == null) {
            throw new AppException(ErrorCode.SHIPPER_PROFILE_NOT_FOUND);
        }

        BigDecimal amount = request.getAmount();

        // Validate số tiền rút > 0
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new AppException(ErrorCode.INVALID_WITHDRAW_AMOUNT);
        }

        // Validate số dư đủ
        if (shipperProfile.getBalance().compareTo(amount) < 0) {
            throw new AppException(ErrorCode.INSUFFICIENT_BALANCE);
        }

        // Trừ tiền ngay (hold)
        BigDecimal balanceAfter = shipperProfile.getBalance().subtract(amount);
        shipperProfile.setBalance(balanceAfter);
        shipperProfileRepository.save(shipperProfile);

        // Tạo giao dịch rút tiền PENDING
        String description = request.getDescription();
        if (description == null || description.isBlank()) {
            description = "Yêu cầu rút tiền";
            if (request.getBankName() != null && !request.getBankName().isBlank()) {
                description += " về " + request.getBankName();
            }
            if (request.getBankAccountNumber() != null && !request.getBankAccountNumber().isBlank()) {
                description += " - STK: " + request.getBankAccountNumber();
            }
        }

        WalletTransaction transaction = new WalletTransaction();
        transaction.setShipperProfile(shipperProfile);
        transaction.setAmount(amount);
        transaction.setBalanceAfter(balanceAfter);
        transaction.setType(TransactionType.DEBIT);
        transaction.setAction(TransactionAction.WITHDRAW_TO_BANK);
        transaction.setStatus(TransactionStatus.PENDING);
        transaction.setDescription(description);
        repository.save(transaction);

        log.info("Shipper {} requested withdrawal of {}. Balance after: {}",
                shipperProfile.getUserId(), amount, balanceAfter);

        return WithdrawResponse.builder()
                .transactionId(transaction.getId())
                .amount(amount)
                .balanceAfter(balanceAfter)
                .status(TransactionStatus.PENDING.name())
                .description(description)
                .createdAt(transaction.getCreatedAt().toString())
                .build();
    }
}
