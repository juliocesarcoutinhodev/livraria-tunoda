package br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.melhorenvio;

import br.com.iraquitantunoda.livrariatunoda.domain.gateway.ShippingCalculator;
import br.com.iraquitantunoda.livrariatunoda.domain.model.ShippingQuote;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.Money;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.ShippingItem;
import br.com.iraquitantunoda.livrariatunoda.domain.model.vo.ShippingOption;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.melhorenvio.config.MelhorEnvioProperties;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.melhorenvio.dto.MelhorEnvioCalculateRequest;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.gateway.melhorenvio.dto.MelhorEnvioCalculateResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

/**
 * Adapter que implementa o cálculo de frete usando o Melhor Envio.
 * Converte dados do domínio para o formato da API e vice-versa.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class MelhorEnvioShippingCalculator implements ShippingCalculator {

    private final MelhorEnvioClient client;
    private final MelhorEnvioProperties properties;

    // CEP padrão de destino para testes (pode ser parametrizado futuramente)
    private static final String DEFAULT_TO_POSTAL_CODE = "05508-900";

    @Override
    public ShippingQuote calculate(ShippingQuote quote) {
        log.info("Calculando frete para cotação {}", quote.getId().getValue());

        try {
            var request = buildRequest(quote);
            var responses = client.calculate(request);

            if (responses.isEmpty()) {
                log.warn("Nenhuma opção de frete retornada para cotação {}", quote.getId().getValue());
                return quote;
            }

            var options = normalizeOptions(responses);

            // Cria nova cotação com as opções calculadas
            return ShippingQuote.create(
                quote.getCartId(),
                quote.getItems(),
                options
            );

        } catch (Exception e) {
            log.error("Erro ao calcular frete para cotação {}: {}",
                quote.getId().getValue(), e.getMessage());
            throw new RuntimeException("Falha ao calcular frete", e);
        }
    }

    /**
     * Constrói o request para a API do Melhor Envio a partir da cotação.
     */
    private MelhorEnvioCalculateRequest buildRequest(ShippingQuote quote) {
        var from = new MelhorEnvioCalculateRequest.FromAddress(
            properties.getFromPostalCode()
        );

        var to = new MelhorEnvioCalculateRequest.ToAddress(
            DEFAULT_TO_POSTAL_CODE
        );

        var products = quote.getItems().stream()
            .map(this::convertToProduct)
            .toList();

        return new MelhorEnvioCalculateRequest(from, to, products);
    }

    /**
     * Converte ShippingItem do domínio para Product da API.
     */
    private MelhorEnvioCalculateRequest.Product convertToProduct(ShippingItem item) {
        // Converte peso para gramas (API espera em gramas)
        var weightInGrams = convertToGrams(item.getWeight().getValue());

        return new MelhorEnvioCalculateRequest.Product(
            item.getBookId().getValue(),
            properties.getDefaultWidth(),
            properties.getDefaultHeight(),
            properties.getDefaultLength(),
            weightInGrams,
            item.getUnitPrice().getAmount(),
            item.getQuantity()
        );
    }

    /**
     * Converte peso para gramas (API do Melhor Envio usa gramas).
     */
    private BigDecimal convertToGrams(BigDecimal weight) {
        // Assume que o peso vem em kg, converte para gramas
        return weight.multiply(BigDecimal.valueOf(1000));
    }

    /**
     * Normaliza as opções retornadas pela API para o formato do domínio.
     */
    private List<ShippingOption> normalizeOptions(List<MelhorEnvioCalculateResponse> responses) {
        return responses.stream()
            .map(this::convertToShippingOption)
            .toList();
    }

    /**
     * Converte response da API para ShippingOption do domínio.
     */
    private ShippingOption convertToShippingOption(MelhorEnvioCalculateResponse response) {
        return ShippingOption.create(
            extractServiceCode(response.name()),
            response.name(),
            Money.brl(response.getFinalPrice()),
            response.getFinalDeliveryTime(),
            response.company().name(),
            response.id()
        );
    }

    /**
     * Extrai código do serviço a partir do nome.
     * Ex: "PAC" de "PAC - Correios"
     */
    private String extractServiceCode(String name) {
        if (name == null || name.isBlank()) {
            return "UNKNOWN";
        }

        var parts = name.split("-");
        return parts[0].trim().toUpperCase();
    }
}

