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

    String shippingQuoteId,

    @NotBlank(message = "Nome do cliente e obrigatorio")
    String customerName,

    @NotBlank(message = "Email do cliente e obrigatorio")
    @jakarta.validation.constraints.Email(message = "Email do cliente invalido")
    String customerEmail,

    @NotBlank(message = "Telefone do cliente e obrigatorio")
    String customerPhone,

    @NotBlank(message = "Rua e obrigatoria")
    String street,

    @NotBlank(message = "Numero e obrigatorio")
    String number,

    String complement,

    @NotBlank(message = "Bairro e obrigatorio")
    String neighborhood,

    @NotBlank(message = "Cidade e obrigatoria")
    String city,

    @NotBlank(message = "Estado e obrigatorio")
    String state,

    @NotBlank(message = "CEP e obrigatorio")
    String postalCode
) {
}
