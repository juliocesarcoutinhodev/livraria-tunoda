package br.com.iraquitantunoda.livrariatunoda.infrastructure.web.controller;

import br.com.iraquitantunoda.livrariatunoda.application.dto.AddItemToCartRequest;
import br.com.iraquitantunoda.livrariatunoda.application.dto.CartResponse;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.AddItemToCartUseCase;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.CreateCartUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carts")
@RequiredArgsConstructor
public class CartController {

    private final CreateCartUseCase createCartUseCase;
    private final AddItemToCartUseCase addItemToCartUseCase;

    @PostMapping
    public ResponseEntity<CartResponse> createCart() {
        var response = createCartUseCase.execute();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/{cartId}/items")
    public ResponseEntity<CartResponse> addItemToCart(
        @PathVariable String cartId,
        @Valid @RequestBody AddItemToCartRequest request
    ) {
        var response = addItemToCartUseCase.execute(cartId, request);
        return ResponseEntity.ok(response);
    }
}

