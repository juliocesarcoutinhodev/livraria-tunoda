package br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.adapter;

import br.com.iraquitantunoda.livrariatunoda.domain.model.Order;
import br.com.iraquitantunoda.livrariatunoda.domain.model.OrderId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.OrderStatus;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.OrderRepository;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.mapper.OrderMapper;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository.OrderJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OrderRepositoryAdapter implements OrderRepository {

    private final OrderJpaRepository jpaRepository;
    private final OrderMapper mapper;

    @Override
    public Order save(Order order) {
        var entity = mapper.toEntityWithItems(order);
        var saved = jpaRepository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Order> findById(OrderId id) {
        return jpaRepository.findById(id.getValue())
            .map(mapper::toDomain);
    }

    @Override
    public PageResult<Order> findWithFilters(int page, int size, OrderStatus status, String sortBy, String sortDirection) {
        var sort = createSort(sortBy != null ? sortBy : "createdAt", sortDirection != null ? sortDirection : "desc");
        var pageable = PageRequest.of(page, size, sort);
        var pageResult = jpaRepository.findWithFilters(status, pageable);

        var orders = pageResult.getContent().stream()
            .map(mapper::toDomain)
            .toList();

        return new PageResultImpl<>(
            orders,
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

    private record PageResultImpl<T>(
        List<T> content,
        int page,
        int size,
        long totalElements
    ) implements PageResult<T> {}
}
