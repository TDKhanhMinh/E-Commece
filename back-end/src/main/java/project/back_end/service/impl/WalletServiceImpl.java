package project.back_end.service.impl;

import lombok.AllArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
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
import project.back_end.repository.NotificationRepository;
import project.back_end.repository.UserRepository;
import project.back_end.repository.WalletTransactionRepository;
import project.back_end.service.WalletService;

import java.math.BigDecimal;

@Service
@AllArgsConstructor
public class WalletServiceImpl implements WalletService {
    private final ApplicationEventPublisher eventPublisher;
    private final WalletTransactionRepository repository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;


    @Override
    public void addDeliveryFee(String email, BigDecimal fee, Long orderId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        ShipperProfile shipperProfile = user.getShipperProfile();
        if (shipperProfile == null) {
            throw new AppException(ErrorCode.SHIPPER_PROFILE_NOT_FOUND);
        }
        // Tạo một giao dịch mới cho shipper
        WalletTransaction transaction = new WalletTransaction();
        transaction.setShipperProfile(shipperProfile);
        transaction.setAmount(fee);
        transaction.setStatus(TransactionStatus.PENDING);
        transaction.setAction(TransactionAction.DELIVERY_FEE);
        transaction.setType(TransactionType.CREDIT);
        transaction.setReferenceId(orderId);
        transaction.setDescription("Nhận cước giao hàng từ đơn hàng #" + orderId);
        repository.save(transaction);

        // Phát sự kiện để cập nhật ví của shipper
        eventPublisher.publishEvent(new WalletTransactionEvent(transaction, user.getDeviceToken()));

    }
}
