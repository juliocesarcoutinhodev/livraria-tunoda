package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.PaymentResponse;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.PaymentDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.PaymentId;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Use Case: Consultar pagamento por ID
 * Permite ao cliente consultar o status e detalhes do pagamento.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class GetPaymentUseCase {

    private final PaymentRepository paymentRepository;
    private final PaymentDTOMapper paymentDTOMapper;

    @Transactional(readOnly = true)
    public PaymentResponse execute(String paymentId) {
        log.info("Consultando pagamento: {}", paymentId);

        var payment = paymentRepository.findById(PaymentId.of(paymentId))
            .orElseThrow(() -> new ResourceNotFoundException("Pagamento não encontrado"));

        log.info("Pagamento encontrado. Status: {}", payment.getStatus());

        return paymentDTOMapper.toResponse(payment);
    }
}

