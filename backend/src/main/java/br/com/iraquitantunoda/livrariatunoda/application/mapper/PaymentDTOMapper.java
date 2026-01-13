package br.com.iraquitantunoda.livrariatunoda.application.mapper;

import br.com.iraquitantunoda.livrariatunoda.application.dto.PaymentResponse;
import br.com.iraquitantunoda.livrariatunoda.domain.model.Payment;
import org.springframework.stereotype.Component;

@Component
public class PaymentDTOMapper {

    public PaymentResponse toResponse(Payment payment) {
        return new PaymentResponse(
            payment.getId().getValue(),
            payment.getOrderId().getValue(),
            payment.getAmount().getAmount(),
            payment.getAmount().getCurrency(),
            payment.getMethod(),
            payment.getStatus(),
            payment.getGateway(),
            payment.getExternalReference(),
            payment.getRejectionReason(),
            payment.getCreatedAt(),
            payment.getUpdatedAt()
        );
    }
}

