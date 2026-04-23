package project.back_end.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import project.back_end.request.WithdrawRequest;
import project.back_end.response.BalanceAndRevenueResponse;
import project.back_end.response.PaymentTransactionResponse;
import project.back_end.response.WalletTransactionResponse;
import project.back_end.response.WithdrawResponse;

import java.math.BigDecimal;
import java.util.Map;

public interface WalletService {

    void createPaymentTransaction(Long orderId, Map<String, String> vnpayParams);

    void addDeliveryFee(String email, BigDecimal fee, Long orderId);

    Page<WalletTransactionResponse> getAllTransactions(String status, Pageable pageable, String type, String action,
            String startDate, String endDate);

    Page<PaymentTransactionResponse> getAllPaymentTransactions(String status, Pageable pageable,
            String startDate, String endDate);

    BalanceAndRevenueResponse getShipperBalanceAndRevenue(String email);

    Page<WalletTransactionResponse> getShipperHistoryTransactions(String email, Pageable pageable);

    void updateTransactionStatus(Long transactionId, String status);

    WithdrawResponse requestWithdrawal(String email, WithdrawRequest request);
}
