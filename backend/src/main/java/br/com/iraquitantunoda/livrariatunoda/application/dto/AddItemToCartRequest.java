package br.com.iraquitantunoda.livrariatunoda.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record AddItemToCartRequest(

    @NotBlank(message = "O identificador do livro é obrigatório")
    String bookId,

    @Positive(message = "A quantidade deve ser maior que zero")
    int quantity
) {
}

