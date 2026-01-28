package br.com.iraquitantunoda.livrariatunoda.infrastructure.config;

import br.com.iraquitantunoda.livrariatunoda.domain.service.FrontendUrlProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class FrontendUrlProviderImpl implements FrontendUrlProvider {

    private final String baseUrl;

    public FrontendUrlProviderImpl(@Value("${app.frontend.base-url}") String baseUrl) {
        this.baseUrl = normalizeBaseUrl(baseUrl);
    }

    @Override
    public String getOrderConfirmationUrl(String orderId) {
        return baseUrl + "/pedido/" + orderId + "/confirmacao";
    }

    private String normalizeBaseUrl(String value) {
        if (value == null || value.isBlank()) {
            return "http://localhost:3000";
        }
        var trimmed = value.trim();
        if (trimmed.endsWith("/")) {
            return trimmed.substring(0, trimmed.length() - 1);
        }
        return trimmed;
    }
}
