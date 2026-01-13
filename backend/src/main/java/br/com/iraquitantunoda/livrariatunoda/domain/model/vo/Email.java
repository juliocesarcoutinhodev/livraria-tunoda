package br.com.iraquitantunoda.livrariatunoda.domain.model.vo;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import lombok.Value;

import java.util.regex.Pattern;

/**
 * Value Object que representa um endereco de email valido.
 * Imutavel e com validacao de formato.
 */
@Value
public class Email {
    String value;

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    public static Email of(String value) {
        validate(value);
        return new Email(value.toLowerCase().trim());
    }

    private static void validate(String value) {
        if (value == null || value.isBlank()) {
            throw new BusinessException("Email nao pode ser nulo ou vazio");
        }

        String trimmed = value.trim();

        if (trimmed.length() > 255) {
            throw new BusinessException("Email nao pode exceder 255 caracteres");
        }

        if (!EMAIL_PATTERN.matcher(trimmed).matches()) {
            throw new BusinessException("Formato de email invalido");
        }
    }
}

