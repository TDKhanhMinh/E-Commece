package project.back_end.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import project.back_end.entity.PaymentTransaction;
import project.back_end.enumerate.PaymentStatus;

import java.time.LocalDateTime;
import java.util.Optional;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {

    Optional<PaymentTransaction> findByOrderId(Long orderId);

    Optional<PaymentTransaction> findByTransactionCode(String transactionCode);

    @Query("""
            SELECT pt FROM PaymentTransaction pt
            WHERE (:status IS NULL OR pt.status = :status)
            AND (CAST(:createdAtAfter AS timestamp) IS NULL OR pt.createdAt >= :createdAtAfter)
            AND (CAST(:createdAtBefore AS timestamp) IS NULL OR pt.createdAt <= :createdAtBefore)
            ORDER BY pt.createdAt DESC
            """)
    Page<PaymentTransaction> filterPaymentTransactions(
            PaymentStatus status,
            LocalDateTime createdAtAfter,
            LocalDateTime createdAtBefore,
            Pageable pageable);
}
