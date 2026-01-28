package br.com.iraquitantunoda.livrariatunoda.application.usecase;

import br.com.iraquitantunoda.livrariatunoda.application.dto.DashboardMetricsResponse;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.metric.BookMetricRepository;
import br.com.iraquitantunoda.livrariatunoda.domain.metric.EventType;
import br.com.iraquitantunoda.livrariatunoda.domain.model.BookId;
import br.com.iraquitantunoda.livrariatunoda.domain.repository.BookRepository;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository.OrderItemJpaRepository;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.persistence.repository.OrderJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GetDashboardMetricsUseCase {

    private final OrderJpaRepository orderJpaRepository;
    private final OrderItemJpaRepository orderItemJpaRepository;
    private final BookMetricRepository bookMetricRepository;
    private final BookRepository bookRepository;

    @Transactional(readOnly = true)
    public DashboardMetricsResponse execute(int days, int topLimit) {
        validateParams(days, topLimit);

        var kpis = buildKpis();
        var ordersByDay = buildOrdersByDay(days);
        var topSold = buildTopSold(days, topLimit);
        var mostViewed = buildTopMetrics(EventType.VIEW, topLimit);
        var mostClicked = buildTopMetrics(EventType.CLICK, topLimit);

        return new DashboardMetricsResponse(kpis, ordersByDay, topSold, mostViewed, mostClicked);
    }

    private DashboardMetricsResponse.DashboardKpis buildKpis() {
        var totalOrders = orderJpaRepository.count();

        var today = LocalDate.now();
        var startOfDay = today.atStartOfDay();
        var endOfDay = today.plusDays(1).atStartOfDay();

        var startOfMonth = today.withDayOfMonth(1).atStartOfDay();

        var ordersDaily = orderJpaRepository.countByCreatedAtBetween(startOfDay, endOfDay);
        var ordersMonthly = orderJpaRepository.countByCreatedAtBetween(startOfMonth, endOfDay);

        return new DashboardMetricsResponse.DashboardKpis(totalOrders, ordersMonthly, ordersDaily);
    }

    private List<DashboardMetricsResponse.OrdersByDayResponse> buildOrdersByDay(int days) {
        var today = LocalDate.now();
        var startDate = today.minusDays(days - 1).atStartOfDay();

        var results = orderJpaRepository.countOrdersByDay(startDate);
        var map = new HashMap<LocalDate, Long>();
        for (var item : results) {
            map.put(item.getDate(), item.getTotal());
        }

        return today.minusDays(days - 1)
            .datesUntil(today.plusDays(1))
            .map(date -> new DashboardMetricsResponse.OrdersByDayResponse(date, map.getOrDefault(date, 0L)))
            .collect(Collectors.toList());
    }

    private List<DashboardMetricsResponse.TopSoldBookResponse> buildTopSold(int days, int limit) {
        var startDate = LocalDate.now().minusDays(days - 1).atStartOfDay();
        var pageable = PageRequest.of(0, limit);
        return orderItemJpaRepository.findTopSoldBooks(startDate, pageable).stream()
            .map(item -> new DashboardMetricsResponse.TopSoldBookResponse(
                item.getBookId(),
                item.getTitle(),
                item.getTotalSold() != null ? item.getTotalSold() : 0L
            ))
            .collect(Collectors.toList());
    }

    private List<DashboardMetricsResponse.TopBookMetricResponse> buildTopMetrics(EventType eventType, int limit) {
        var summaries = bookMetricRepository.findTopBooksByEventType(eventType, limit);
        return summaries.stream()
            .map(summary -> {
                var bookId = BookId.of(summary.getBookId());
                var bookOpt = bookRepository.findById(bookId);
                if (bookOpt.isEmpty()) {
                    return null;
                }
                var book = bookOpt.get();
                if (!book.isActive()) {
                    return null;
                }
                return new DashboardMetricsResponse.TopBookMetricResponse(
                    book.getId().getValue(),
                    book.getTitle(),
                    summary.getTotalMetrics() != null ? summary.getTotalMetrics() : 0L
                );
            })
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
    }

    private void validateParams(int days, int topLimit) {
        if (days <= 0 || days > 60) {
            throw new BusinessException("Parametro days deve estar entre 1 e 60");
        }
        if (topLimit <= 0 || topLimit > 50) {
            throw new BusinessException("Parametro topLimit deve estar entre 1 e 50");
        }
    }
}
