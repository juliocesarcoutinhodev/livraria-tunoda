package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.OrderLookupRequest;
import br.com.iraquitantunoda.livrariatunoda.application.dto.OrderLookupResponse;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.OrderId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Email;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderLookupUseCase {

    private static final String INVALID_MESSAGE = "Pedido nao encontrado para este email.";

    private final OrderRepository orderRepository;

    public OrderLookupResponse execute(OrderLookupRequest request) {
        var normalizedEmail = normalizeEmail(request.email());
        if (normalizedEmail == null) {
            return invalidResponse();
        }

        var orderId = parseOrderId(request.orderId());
        if (orderId == null) {
            return invalidResponse();
        }

        var order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return invalidResponse();
        }

        if (order.getCustomerEmail() == null || !order.getCustomerEmail().equals(normalizedEmail)) {
            log.warn("Lookup invalido para pedido {}", orderId.getValue());
            return invalidResponse();
        }

        var redirectUrl = "/pedido/" + orderId.getValue() + "/confirmacao";
        return new OrderLookupResponse(true, orderId.getValue(), redirectUrl, null);
    }

    private OrderLookupResponse invalidResponse() {
        return new OrderLookupResponse(false, null, null, INVALID_MESSAGE);
    }

    private String normalizeEmail(String email) {
        try {
            return Email.of(email).getValue();
        } catch (BusinessException ex) {
            return null;
        }
    }

    private OrderId parseOrderId(String value) {
        try {
            return OrderId.of(value);
        } catch (BusinessException ex) {
            return null;
        }
    }
}
