package br.com.iraquitantunoda.livrariatunoda.application.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.Set;

public record UpdateBookRequest(

    @NotBlank(message = "O título do livro é obrigatório")
    @Size(max = 300, message = "O título não pode exceder 300 caracteres")
    String title,

    @NotBlank(message = "A descrição do livro é obrigatória")
    String description,

    String photoUrl,

    String isbn,

    @NotNull(message = "O preço do livro é obrigatório")
    @Positive(message = "O preço deve ser maior que zero")
    BigDecimal price,

    String currency,

    @NotNull(message = "O peso do livro é obrigatório")
    @Positive(message = "O peso deve ser maior que zero")
    BigDecimal weight,

    @NotBlank(message = "A unidade de peso é obrigatória")
    String weightUnit,

    @NotEmpty(message = "O livro deve ter pelo menos um autor")
    Set<String> authorIds,

    @NotBlank(message = "O status é obrigatório")
    String status
) {
}

