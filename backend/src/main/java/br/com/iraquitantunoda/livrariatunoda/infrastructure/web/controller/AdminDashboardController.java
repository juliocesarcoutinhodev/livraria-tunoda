package br.com.iraquitantunoda.livrariatunoda.infrastructure.web.controller;

import br.com.iraquitantunoda.livrariatunoda.application.dto.DashboardMetricsResponse;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.GetDashboardMetricsUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final GetDashboardMetricsUseCase getDashboardMetricsUseCase;

    @GetMapping("/metrics")
    public ResponseEntity<DashboardMetricsResponse> getMetrics(
        @RequestParam(defaultValue = "30") int days,
        @RequestParam(defaultValue = "10") int topLimit
    ) {
        var response = getDashboardMetricsUseCase.execute(days, topLimit);
        return ResponseEntity.ok(response);
    }
}
