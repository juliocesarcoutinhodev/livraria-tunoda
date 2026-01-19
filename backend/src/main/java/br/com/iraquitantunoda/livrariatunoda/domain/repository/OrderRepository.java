package br.com.iraquitantunoda.livrariatunoda.domain.repository;

import br.com.iraquitantunoda.livrariatunoda.domain.model.Order;
import br.com.iraquitantunoda.livrariatunoda.domain.model.OrderId;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.OrderStatus;

import java.util.List;
import java.util.Optional;

public interface OrderRepository {

    Order save(Order order);

    Optional<Order> findById(OrderId id);

    PageResult<Order> findWithFilters(int page, int size, OrderStatus status, String sortBy, String sortDirection);

    interface PageResult<T> {
        List<T> content();
        int page();
        int size();
        long totalElements();
    }
}

