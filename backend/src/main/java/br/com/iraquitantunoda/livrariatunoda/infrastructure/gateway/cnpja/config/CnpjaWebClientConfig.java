package br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.cnpja.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;

@Configuration
public class CnpjaWebClientConfig {

    @Bean
    public WebClient cnpjaWebClient(CnpjaProperties properties) {
        var httpClient = HttpClient.create()
            .responseTimeout(Duration.ofSeconds(properties.getTimeoutSeconds()));

        return WebClient.builder()
            .baseUrl(properties.getBaseUrl())
            .clientConnector(new ReactorClientHttpConnector(httpClient))
            .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .defaultHeader(HttpHeaders.AUTHORIZATION, properties.getToken())
            .build();
    }
}
