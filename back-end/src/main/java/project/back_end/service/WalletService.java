package project.back_end.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import project.back_end.response.WalletTransactionResponse;

import java.math.BigDecimal;

public interface WalletService {
    void addDeliveryFee(String email, BigDecimal fee, Long orderId);

    Page<WalletTransactionResponse> getShipperHistoryTransactions(String email, Pageable pageable);
}
