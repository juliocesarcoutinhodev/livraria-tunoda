package br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.cnpja.config;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

@Configuration
@ConfigurationProperties(prefix = "cnpja")
@Validated
@Getter
@Setter
public class CnpjaProperties {

    @NotBlank(message = "Base URL do CNPJa e obrigatoria")
    private String baseUrl;

    @NotBlank(message = "Token do CNPJa e obrigatorio")
    private String token;

    @Min(value = 1, message = "Timeout minimo: 1 segundo")
    private int timeoutSeconds;

    @NotBlank(message = "Endpoint de consulta de CEP e obrigatorio")
    private String zipEndpoint;
}
