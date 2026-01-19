package br.com.iraquitantunoda.livrariatunoda.infrastructure.web.controller;

import br.com.iraquitantunoda.livrariatunoda.application.dto.OrderResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.PageResponse;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.ListOrdersUseCase;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final ListOrdersUseCase listOrdersUseCase;

    @GetMapping
    public ResponseEntity<PageResponse<OrderResponse>> listOrders(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) OrderStatus status,
        @RequestParam(required = false) String sortBy,
        @RequestParam(required = false) String sortDirection
    ) {
        var response = listOrdersUseCase.execute(page, size, status, sortBy, sortDirection);
        return ResponseEntity.ok(response);
    }
}
