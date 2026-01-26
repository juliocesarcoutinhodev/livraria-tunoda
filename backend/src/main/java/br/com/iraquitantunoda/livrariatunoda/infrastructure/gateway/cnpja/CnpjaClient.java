package br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.cnpja;

import br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException;
import br.com.iraquitantunoda.livrariatunoda.domain.exception.ResourceNotFoundException;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.cnpja.config.CnpjaProperties;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.cnpja.dto.CnpjaZipApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Component
@RequiredArgsConstructor
@Slf4j
public class CnpjaClient {

    private final WebClient cnpjaWebClient;
    private final CnpjaProperties properties;

    public CnpjaZipApiResponse fetchZip(String zipCode) {
        try {
            return cnpjaWebClient.get()
                .uri(uriBuilder -> uriBuilder.path(properties.getZipEndpoint()).build(zipCode))
                .retrieve()
                .bodyToMono(CnpjaZipApiResponse.class)
                .block();
        } catch (WebClientResponseException e) {
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                throw new ResourceNotFoundException("CEP não encontrado");
            }
            log.error("Erro ao consultar CNPJa: status={} body={}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new BusinessException("Falha ao consultar CEP");
        } catch (Exception e) {
            log.error("Erro inesperado ao consultar CNPJa: {}", e.getMessage());
            throw new BusinessException("Falha ao consultar CEP");
        }
    }
}
