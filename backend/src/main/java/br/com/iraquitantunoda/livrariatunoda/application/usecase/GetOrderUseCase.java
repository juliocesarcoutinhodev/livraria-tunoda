package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.OrderResponse;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.OrderDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.domain.model.OrderId;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GetOrderUseCase {

    private final OrderRepository orderRepository;
    private final OrderDTOMapper orderDTOMapper;

    @Transactional(readOnly = true)
    public OrderResponse execute(String orderId) {
        var order = orderRepository.findById(OrderId.of(orderId))
            .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado"));

        return orderDTOMapper.toResponse(order);
    }
}

