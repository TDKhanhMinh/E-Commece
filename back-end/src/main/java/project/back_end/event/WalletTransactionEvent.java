package project.back_end.event;

import project.back_end.entity.WalletTransaction;

public record WalletTransactionEvent(WalletTransaction transaction, String deviceToken) {
}