package br.com.iraquitantunoda.livrariatunoda.domain.model.vo;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import lombok.Value;

import java.math.BigDecimal;

@Value
public class Weight {
    BigDecimal value;
    WeightUnit unit;

    public static Weight of(BigDecimal value, WeightUnit unit) {
        if (value == null || value.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("O peso deve ser maior que zero");
        }
        if (unit == null) {
            throw new BusinessException("A unidade de peso deve ser informada");
        }
        return new Weight(value, unit);
    }

    public static Weight grams(BigDecimal value) {
        return of(value, WeightUnit.GRAMS);
    }

    public static Weight kilograms(BigDecimal value) {
        return of(value, WeightUnit.KILOGRAMS);
    }
}