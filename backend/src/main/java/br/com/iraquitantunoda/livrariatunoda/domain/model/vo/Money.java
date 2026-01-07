package br.com.iraquitantunoda.livrariatunoda.domain.model.vo;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import lombok.Value;

import java.math.BigDecimal;

@Value
public class Money {
    BigDecimal amount;
    String currency;

    public static Money of(BigDecimal amount, String currency) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessException("O valor monetário não pode ser negativo");
        }
        if (currency == null || currency.isBlank()) {
            throw new BusinessException("A moeda deve ser informada");
        }
        return new Money(amount, currency);
    }

    public static Money brl(BigDecimal amount) {
        return of(amount, "BRL");
    }
}