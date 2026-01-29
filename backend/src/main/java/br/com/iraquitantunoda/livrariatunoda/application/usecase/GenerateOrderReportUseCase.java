package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.OrderId;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.OrderRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.service.OrderReportGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GenerateOrderReportUseCase {

    private final OrderRepository orderRepository;
    private final OrderReportGenerator orderReportGenerator;

    @Transactional(readOnly = true)
    public byte[] execute(String orderId) {
        var id = OrderId.of(orderId);
        orderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado"));

        return orderReportGenerator.generateOrderReportPdf(id.getValue());
    }
}
