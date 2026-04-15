package project.back_end.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import project.back_end.entity.WalletTransaction;
import project.back_end.response.BalanceAndRevenueResponse;
import project.back_end.response.WalletTransactionResponse;

import java.math.BigDecimal;

@Mapper(componentModel = "spring")

public interface WalletMapper {
    @Mapping(source = "id", target = "transactionId")
    @Mapping(source = "type", target = "type")
    @Mapping(source = "action", target = "transactionAction")
    @Mapping(source = "status", target = "transactionStatus")
    @Mapping(source = "amount", target = "amount")
    @Mapping(source = "description", target = "description")
    @Mapping(source = "createdAt", target = "createdAt")
    WalletTransactionResponse toWalletTransactionResponse(WalletTransaction transaction);

    @Mapping(source = "balance", target = "balance")
    @Mapping(source = "revenueInCurrentMonth", target = "revenueInCurrentMonth")
    @Mapping(source = "revenueInCurrentDay", target = "revenueInCurrentDay")
    BalanceAndRevenueResponse toBalanceAndRevenueResponse(BigDecimal balance, BigDecimal revenueInCurrentMonth, BigDecimal revenueInCurrentDay);
}
