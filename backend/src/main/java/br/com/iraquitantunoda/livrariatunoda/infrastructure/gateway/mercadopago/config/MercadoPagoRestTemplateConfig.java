package br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.mercadopago.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.BufferingClientHttpRequestFactory;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

/**
 * Configuração do RestTemplate para chamadas ao Mercado Pago.
 */
@Configuration
@Slf4j
public class MercadoPagoRestTemplateConfig {

    @Bean(name = "mercadoPagoRestTemplate")
    public RestTemplate mercadoPagoRestTemplate(
        RestTemplateBuilder builder,
        MercadoPagoProperties properties
    ) {
        var timeout = Duration.ofSeconds(properties.getTimeoutSeconds());

        return builder
            .rootUri(properties.getBaseUrl())
            .connectTimeout(timeout)
            .readTimeout(timeout)
            .defaultHeader("Accept", "application/json")
            .defaultHeader("Content-Type", "application/json")
            .defaultHeader("Authorization", "Bearer " + properties.getAccessToken())
            .requestFactory(() -> new BufferingClientHttpRequestFactory(new SimpleClientHttpRequestFactory()))
            .interceptors(new MercadoPagoLoggingInterceptor())
            .build();
    }

    /**
     * Interceptor para logging de requisições e respostas.
     */
    @Slf4j
    private static class MercadoPagoLoggingInterceptor implements ClientHttpRequestInterceptor {

        @Override
        public org.springframework.http.client.ClientHttpResponse intercept(
            org.springframework.http.HttpRequest request,
            byte[] body,
            org.springframework.http.client.ClientHttpRequestExecution execution
        ) throws java.io.IOException {

            log.debug("===========================Request Begin===========================");
            log.debug("URI         : {}", request.getURI());
            log.debug("Method      : {}", request.getMethod());
            log.debug("Headers     : {}", request.getHeaders());
            log.debug("Request body: {}", new String(body));
            log.debug("===========================Request End=============================");

            var response = execution.execute(request, body);

            log.debug("===========================Response Begin==========================");
            log.debug("Status code  : {} {}", response.getStatusCode().value(), response.getStatusText());
            log.debug("Status text  : {}", response.getStatusText());
            log.debug("Headers      : {}", response.getHeaders());
            log.debug("===========================Response End============================");

            return response;
        }
    }
}

