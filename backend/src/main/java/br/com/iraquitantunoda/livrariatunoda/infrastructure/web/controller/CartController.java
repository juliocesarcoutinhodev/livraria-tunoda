package br.com.iraquitantunoda.livrariatunoda.infrastructure.web.controller;

import br.com.iraquitantunoda.livrariatunoda.application.dto.CartResponse;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.CreateCartUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/carts")
@RequiredArgsConstructor
public class CartController {

    private final CreateCartUseCase createCartUseCase;

    @PostMapping
    public ResponseEntity<CartResponse> createCart() {
        var response = createCartUseCase.execute();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

