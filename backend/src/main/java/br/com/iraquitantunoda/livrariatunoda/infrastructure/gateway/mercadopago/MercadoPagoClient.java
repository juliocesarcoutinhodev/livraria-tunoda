package br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.mercadopago;

import br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.mercadopago.config.MercadoPagoProperties;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.mercadopago.dto.MercadoPagoPreferenceRequest;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.mercadopago.dto.MercadoPagoPreferenceResponse;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.mercadopago.exception.MercadoPagoException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

/**
 * Client HTTP para comunicação com a API do Mercado Pago.
 * Implementa retry automático em caso de falha.
 */
@Component
@Slf4j
public class MercadoPagoClient {

    private final RestTemplate restTemplate;
    private final MercadoPagoProperties properties;

    private static final String CREATE_PREFERENCE_ENDPOINT = "/checkout/preferences";

    public MercadoPagoClient(
        @Qualifier("mercadoPagoRestTemplate") RestTemplate restTemplate,
        MercadoPagoProperties properties
    ) {
        this.restTemplate = restTemplate;
        this.properties = properties;
    }

    /**
     * Cria uma preferência de pagamento no Mercado Pago.
     * Retry automático em caso de falha com backoff exponencial.
     */
    @Retryable(
        retryFor = RestClientException.class,
        maxAttempts = 3,
        backoff = @Backoff(delay = 1000, multiplier = 2)
    )
    public MercadoPagoPreferenceResponse createPreference(MercadoPagoPreferenceRequest request) {
        log.info("Criando preferência de pagamento no Mercado Pago");
        log.debug("Request completo: {}", request);

        try {
            var response = restTemplate.postForObject(
                CREATE_PREFERENCE_ENDPOINT,
                request,
                MercadoPagoPreferenceResponse.class
            );

            if (response == null) {
                throw new MercadoPagoException("Mercado Pago retornou resposta vazia");
            }

            log.info("Preferência criada com sucesso. ID: {}", response.id());
            log.debug("Response completo: {}", response);

            return response;

        } catch (RestClientException e) {
            log.error("Erro ao criar preferência no Mercado Pago: {}", e.getMessage());
            throw new MercadoPagoException("Falha ao criar preferência de pagamento", e);
        }
    }
}

