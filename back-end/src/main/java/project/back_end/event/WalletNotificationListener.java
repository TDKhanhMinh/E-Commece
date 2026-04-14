package project.back_end.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import project.back_end.entity.Notification;
import project.back_end.entity.WalletTransaction;
import project.back_end.enumerate.NotificationType;
import project.back_end.enumerate.TransactionStatus;
import project.back_end.repository.NotificationRepository;
import project.back_end.service.NotificationService;

import java.text.NumberFormat;
import java.util.Locale;

@Slf4j
@Component
@RequiredArgsConstructor
public class WalletNotificationListener {

    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;

    @Async
    @EventListener
    public void onTransactionOccurred(WalletTransactionEvent event) {
        WalletTransaction tx = event.transaction();
        String deviceToken = event.deviceToken();

        String title = "";
        String body = "";
        NotificationType notifType = NotificationType.SYSTEM;

        switch (tx.getAction()) {
            case DELIVERY_FEE -> {
                title = "Nhận cước giao hàng";
                body = "Ví của bạn vừa được cộng " + formatCurrency(tx.getAmount()) +
                        " từ đơn hàng #" + tx.getReferenceId();
                notifType = NotificationType.OUTBOUND;
            }
            case WITHDRAW_TO_BANK -> {
                if (tx.getStatus() == TransactionStatus.SUCCESS) {
                    title = "Rút tiền thành công";
                    body = "Số tiền " + formatCurrency(tx.getAmount()) + " đã được chuyển về thẻ ngân hàng của bạn.";
                } else if (tx.getStatus() == TransactionStatus.FAILED) {
                    title = "Rút tiền thất bại";
                    body = "Giao dịch rút tiền không thành công. Hệ thống đã hoàn lại tiền vào ví.";
                } else {
                    // Nếu là PENDING (vừa tạo lệnh xong), có thể bỏ qua không gửi Push
                    // hoặc thông báo "Đã tiếp nhận yêu cầu rút tiền" tùy bạn.
                    return;
                }
                notifType = NotificationType.SYSTEM;
            }
            case BONUS -> {
                title = "Nhận tiền thưởng";
                body = "Hệ thống đã cộng " + formatCurrency(tx.getAmount()) + " tiền thưởng vào ví của bạn. Chúc bạn làm việc hiệu quả!";
                notifType = NotificationType.SYSTEM;
            }
            case PENALTY -> {
                title = "Biến động số dư";
                body = "Ví của bạn bị trừ " + formatCurrency(tx.getAmount()) + ". Lý do: " +
                        (tx.getDescription() != null ? tx.getDescription() : "Vi phạm quy định");
                notifType = NotificationType.SYSTEM;
            }
            case COD_PAYMENT -> {
                title = "Thanh toán thu hộ (COD)";
                body = "Hệ thống đã trừ " + formatCurrency(tx.getAmount()) +
                        " tiền thu hộ cho đơn hàng #" + tx.getReferenceId();
                notifType = NotificationType.SYSTEM;
            }
        }


        // 3. Khởi tạo đối tượng Notification và lưu vào Database
        Notification notification = new Notification();
        notification.setShipperProfile(tx.getShipperProfile());
        notification.setType(notifType);
        notification.setTitle(title);
        notification.setMessage(body);
        notification.setIsRead(false);

        try {
            notificationRepository.save(notification);
            notificationService.sendNotification(
                    deviceToken,
                    notification.getTitle(),
                    notification.getMessage()
            );

        } catch (Exception e) {
            log.error("Lỗi khi xử lý thông báo ví cho Shipper {}: {}", tx.getShipperProfile(), e.getMessage());
        }
    }

    // Hàm hỗ trợ format tiền tệ (VD: 35000 -> 35.000 ₫)
    private String formatCurrency(java.math.BigDecimal amount) {
        if (amount == null) return "0 ₫";
        NumberFormat format = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
        return format.format(amount);
    }
}