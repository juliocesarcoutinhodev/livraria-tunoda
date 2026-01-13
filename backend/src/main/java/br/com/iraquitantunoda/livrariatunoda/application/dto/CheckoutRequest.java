package br.com.iraquitantunoda.livrariatunoda.application.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request para checkout do carrinho com frete opcional.
 * Se shippingQuoteId for informado, valida e inclui frete no pedido.
 * Se shippingQuoteId for null, cria pedido sem frete (gratis).
 */
public record CheckoutRequest(
    @NotBlank(message = "ID do carrinho é obrigatório")
    String cartId,

    String shippingQuoteId
) {
}

