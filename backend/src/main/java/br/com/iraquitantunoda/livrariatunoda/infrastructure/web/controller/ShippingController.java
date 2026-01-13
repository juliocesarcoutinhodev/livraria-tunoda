package br.com.iraquitantunoda.livrariatunoda.infrastructure.web.controller;

import br.com.iraquitantunoda.livrariatunoda.application.dto.CreateShippingQuoteRequest;
import br.com.iraquitantunoda.livrariatunoda.application.dto.ShippingQuoteResponse;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.CalculateShippingUseCase;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.CreateShippingQuoteUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shipping")
@RequiredArgsConstructor
public class ShippingController {

    private final CreateShippingQuoteUseCase createShippingQuoteUseCase;
    private final CalculateShippingUseCase calculateShippingUseCase;

    @PostMapping("/quotes")
    public ResponseEntity<ShippingQuoteResponse> createQuote(@Valid @RequestBody CreateShippingQuoteRequest request) {
        var response = createShippingQuoteUseCase.execute(request.cartId(), request.toPostalCode());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/quotes/{quoteId}/calculate")
    public ResponseEntity<ShippingQuoteResponse> calculateShipping(@PathVariable String quoteId) {
        var response = calculateShippingUseCase.execute(quoteId);
        return ResponseEntity.ok(response);
    }
}

