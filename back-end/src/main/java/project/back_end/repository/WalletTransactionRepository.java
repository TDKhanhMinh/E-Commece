package project.back_end.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import project.back_end.entity.ShipperProfile;
import project.back_end.entity.WalletTransaction;
import project.back_end.enumerate.TransactionAction;
import project.back_end.enumerate.TransactionStatus;
import project.back_end.enumerate.TransactionType;

import java.time.LocalDateTime;
import java.util.List;

public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {
    Page<WalletTransaction> getWalletTransactionsByShipperProfileAndStatus(ShipperProfile shipperProfile, Pageable pageable, TransactionStatus status);

    @Query("SELECT wt FROM WalletTransaction wt WHERE  wt.status = :status  ORDER BY wt.createdAt DESC")
    Page<WalletTransaction> getWalletTransactionsByStatus(TransactionStatus status, Pageable pageable);

    Page<WalletTransaction> getWalletTransactionsByStatusAndTypeAndActionAndCreatedAtBetween(TransactionStatus status, TransactionType type, TransactionAction action, LocalDateTime createdAtAfter, LocalDateTime createdAtBefore, Pageable pageable);

    List<WalletTransaction> findAllByShipperProfileAndActionAndStatusAndTypeAndCreatedAtBetween(ShipperProfile shipperProfile, TransactionAction action, TransactionStatus status, TransactionType type, LocalDateTime createdAtAfter, LocalDateTime createdAtBefore);

    // Query với các điều kiện động khi param bị null
    @Query("""
            SELECT wt FROM WalletTransaction wt
            WHERE (:status IS NULL OR wt.status = :status)
            AND (:type IS NULL OR wt.type = :type)
            AND (:action IS NULL OR wt.action = :action)
            AND (:createdAtAfter IS NULL OR wt.createdAt >= :createdAtAfter)
            AND (:createdAtBefore IS NULL OR wt.createdAt <= :createdAtBefore)
            ORDER BY wt.createdAt DESC
            """)
    Page<WalletTransaction> filterWalletTransactions(
            TransactionStatus status,
            TransactionType type,
            TransactionAction action,
            LocalDateTime createdAtAfter,
            LocalDateTime createdAtBefore,
            Pageable pageable
    );
}
