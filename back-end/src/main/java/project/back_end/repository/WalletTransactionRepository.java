package project.back_end.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import project.back_end.entity.ShipperProfile;
import project.back_end.entity.WalletTransaction;

public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {
    Page<WalletTransaction> getWalletTransactionsByShipperProfile(ShipperProfile shipperProfile, Pageable pageable);
}
