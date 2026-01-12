package br.com.iraquitantunoda.livrariatunoda.infrastructure.web.controller;

import br.com.iraquitantunoda.livrariatunoda.application.dto.AddItemToCartRequest;
import br.com.iraquitantunoda.livrariatunoda.application.dto.CartResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.UpdateCartItemRequest;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.AddItemToCartUseCase;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.CreateCartUseCase;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.RemoveCartItemUseCase;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.UpdateCartItemUseCase;
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
    private final UpdateCartItemUseCase updateCartItemUseCase;
    private final RemoveCartItemUseCase removeCartItemUseCase;

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

    @PutMapping("/{cartId}/items/{bookId}")
    public ResponseEntity<CartResponse> updateCartItem(
        @PathVariable String cartId,
        @PathVariable String bookId,
        @Valid @RequestBody UpdateCartItemRequest request
    ) {
        var response = updateCartItemUseCase.execute(cartId, bookId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{cartId}/items/{bookId}")
    public ResponseEntity<CartResponse> removeCartItem(
        @PathVariable String cartId,
        @PathVariable String bookId
    ) {
        var response = removeCartItemUseCase.execute(cartId, bookId);
        return ResponseEntity.ok(response);
    }
}

