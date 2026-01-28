package br.com.iraquitantunoda.livrariatunoda.application.dto;

import java.time.LocalDate;
import java.util.List;

public record DashboardMetricsResponse(
    DashboardKpis kpis,
    List<OrdersByDayResponse> ordersByDay,
    List<TopSoldBookResponse> topSold,
    List<TopBookMetricResponse> mostViewed,
    List<TopBookMetricResponse> mostClicked
) {
    public record DashboardKpis(
        long totalOrders,
        long ordersMonthly,
        long ordersDaily
    ) {
    }

    public record OrdersByDayResponse(
        LocalDate date,
        long count
    ) {
    }

    public record TopSoldBookResponse(
        String bookId,
        String title,
        long totalSold
    ) {
    }

    public record TopBookMetricResponse(
        String bookId,
        String title,
        long total
    ) {
    }
}
