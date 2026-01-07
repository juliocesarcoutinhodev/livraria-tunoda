package br.com.iraquitantunoda.livrariatunoda.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ChangeStatusRequest(

    @NotBlank(message = "O status é obrigatório")
    @Pattern(regexp = "ACTIVE|INACTIVE", message = "Status deve ser ACTIVE ou INACTIVE")
    String status
) {
}

