package br.com.iraquitantunoda.livrariatunoda.application.dto;

import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.PaymentMethod;
import jakarta.validation.constraints.NotNull;

public record CreatePaymentRequest(
    @NotNull(message = "Método de pagamento é obrigatório")
    PaymentMethod paymentMethod
) {
}

