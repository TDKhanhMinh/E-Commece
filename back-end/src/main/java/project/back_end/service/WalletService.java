package project.back_end.service;

import java.math.BigDecimal;

public interface WalletService {
    void addDeliveryFee(String email, BigDecimal fee, Long orderId);
}
