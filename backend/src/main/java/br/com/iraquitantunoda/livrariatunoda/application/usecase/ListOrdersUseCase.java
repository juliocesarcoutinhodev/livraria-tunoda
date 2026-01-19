package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.OrderResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.PageResponse;
import br.com.iraquitantunoda.livrariatunoda.application.mapper.OrderDTOMapper;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.OrderStatus;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository.OrderJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ListOrdersUseCase {

    private final OrderJpaRepository orderJpaRepository;
    private final OrderDTOMapper orderDTOMapper;

    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> execute(int page, int size, OrderStatus status, String sortBy, String sortDirection) {
        var sort = createSort(sortBy != null ? sortBy : "createdAt", sortDirection != null ? sortDirection : "desc");
        var pageable = PageRequest.of(page, size, sort);
        var pageResult = orderJpaRepository.findWithFilters(status, pageable);

        var responses = pageResult.getContent().stream()
            .map(orderDTOMapper::toResponseFromEntity)
            .toList();

        return new PageResponse<>(
            responses,
            pageResult.getNumber(),
            pageResult.getSize(),
            pageResult.getTotalElements()
        );
    }

    private Sort createSort(String sortBy, String sortDirection) {
        var direction = "desc".equalsIgnoreCase(sortDirection)
            ? Sort.Direction.DESC
            : Sort.Direction.ASC;
        return Sort.by(direction, sortBy);
    }
}
