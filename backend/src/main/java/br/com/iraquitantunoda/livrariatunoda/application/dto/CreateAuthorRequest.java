package br.com.iraquitantunoda.livrariatunoda.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateAuthorRequest(

    @NotBlank(message = "O nome do autor é obrigatório")
    @Size(max = 200, message = "O nome do autor não pode exceder 200 caracteres")
    String name,

    String biography,

    String photoUrl
) {
}

