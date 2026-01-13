package br.com.iraquitantunoda.livrariatunoda.infrastructure.web.controller;

import br.com.iraquitantunoda.livrariatunoda.application.dto.PaymentResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.ProcessPaymentResponse;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.GetPaymentUseCase;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.ProcessPaymentUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final ProcessPaymentUseCase processPaymentUseCase;
    private final GetPaymentUseCase getPaymentUseCase;

    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentResponse> getPayment(@PathVariable String paymentId) {
        var response = getPaymentUseCase.execute(paymentId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{paymentId}/process")
    public ResponseEntity<ProcessPaymentResponse> processPayment(@PathVariable String paymentId) {
        var response = processPaymentUseCase.execute(paymentId);
        return ResponseEntity.ok(response);
    }
}

