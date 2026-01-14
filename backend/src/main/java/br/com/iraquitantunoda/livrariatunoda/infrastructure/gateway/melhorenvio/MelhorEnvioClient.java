package br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.melhorenvio;

import br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.melhorenvio.config.MelhorEnvioProperties;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.melhorenvio.dto.MelhorEnvioCalculateRequest;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.melhorenvio.dto.MelhorEnvioCalculateResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

/**
 * Client HTTP para comunicação com a API do Melhor Envio.
 * Implementa retry automático em caso de falha.
 */
@Component
@Slf4j
public class MelhorEnvioClient {

    private final RestTemplate restTemplate;
    private final MelhorEnvioProperties properties;

    public MelhorEnvioClient(
        @Qualifier("melhorEnvioRestTemplate") RestTemplate restTemplate,
        MelhorEnvioProperties properties
    ) {
        this.restTemplate = restTemplate;
        this.properties = properties;
    }

    /**
     * Calcula frete via API do Melhor Envio.
     * Retry automático em caso de falha com backoff exponencial.
     */
    @Retryable(
        retryFor = RestClientException.class,
        maxAttempts = 3,
        backoff = @Backoff(delay = 1000, multiplier = 2)
    )
    public List<MelhorEnvioCalculateResponse> calculate(MelhorEnvioCalculateRequest request) {
        log.info("Calculando frete via Melhor Envio para {} produtos", request.products().size());
        log.debug("Request completo: {}", request);

        try {
            var response = restTemplate.postForObject(
                properties.getCalculateEndpoint(),
                request,
                MelhorEnvioCalculateResponse[].class
            );

            if (response == null || response.length == 0) {
                log.warn("Melhor Envio retornou resposta vazia");
                return List.of();
            }

            log.debug("Response completo do Melhor Envio: {}", Arrays.toString(response));

            var validOptions = Arrays.stream(response)
                .filter(option -> !option.hasError())
                .toList();

            var optionsWithError = Arrays.stream(response)
                .filter(MelhorEnvioCalculateResponse::hasError)
                .toList();

            if (!optionsWithError.isEmpty()) {
                log.warn("Melhor Envio retornou {} opções com erro:", optionsWithError.size());
                optionsWithError.forEach(option ->
                    log.warn("  - Serviço: {}, Erro: {}", option.name(), option.error())
                );
            }

            log.info("Melhor Envio retornou {} opções válidas de frete", validOptions.size());

            return validOptions;

        } catch (RestClientException e) {
            log.error("Erro ao calcular frete via Melhor Envio: {}", e.getMessage());
            throw e;
        }
    }
}

