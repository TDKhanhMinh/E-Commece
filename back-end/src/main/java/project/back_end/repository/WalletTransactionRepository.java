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


    List<WalletTransaction> findAllByShipperProfileAndActionAndStatusAndTypeAndCreatedAtBetween(ShipperProfile shipperProfile, TransactionAction action, TransactionStatus status, TransactionType type, LocalDateTime createdAtAfter, LocalDateTime createdAtBefore);
}
