package br.com.iraquitantunoda.livrariatunoda.application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record SendTestEmailRequest(
    @NotBlank(message = "Email e obrigatorio")
    @Email(message = "Email invalido")
    String to,

    @NotBlank(message = "Assunto e obrigatorio")
    String subject,

    @NotBlank(message = "Corpo e obrigatorio")
    String body
) {
}
