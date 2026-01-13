package br.com.iraquitantunoda.livrariatunoda.infrastructure.web.controller;

import br.com.iraquitantunoda.livrariatunoda.application.dto.CreatePaymentRequest;
import br.com.iraquitantunoda.livrariatunoda.application.dto.OrderResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.PaymentResponse;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.CreatePaymentUseCase;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.GetOrderUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final GetOrderUseCase getOrderUseCase;
    private final CreatePaymentUseCase createPaymentUseCase;

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable String orderId) {
        var response = getOrderUseCase.execute(orderId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{orderId}/payments")
    public ResponseEntity<PaymentResponse> createPayment(
        @PathVariable String orderId,
        @Valid @RequestBody CreatePaymentRequest request
    ) {
        var response = createPaymentUseCase.execute(orderId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

