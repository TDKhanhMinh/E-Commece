package project.back_end.service.impl;

import lombok.AllArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
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
import project.back_end.response.WalletTransactionResponse;
import project.back_end.service.WalletService;

import java.math.BigDecimal;
import java.util.List;

@Service
@AllArgsConstructor
public class WalletServiceImpl implements WalletService {
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
        repository.save(transaction);
        shipperTransactions.add(transaction);
        shipperProfile.setWalletTransactions(shipperTransactions);
        shipperProfileRepository.save(shipperProfile);

        // Phát sự kiện để cập nhật ví của shipper
        eventPublisher.publishEvent(new WalletTransactionEvent(transaction, user.getDeviceToken()));

    }

    @Override
    public Page<WalletTransactionResponse> getShipperHistoryTransactions(String email, Pageable pageable) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        ShipperProfile shipperProfile = user.getShipperProfile();
        if (shipperProfile == null) {
            throw new AppException(ErrorCode.SHIPPER_PROFILE_NOT_FOUND);
        }
        return repository.getWalletTransactionsByShipperProfile(shipperProfile, pageable)
                .map(walletMapper::toWalletTransactionResponse);

    }
}
