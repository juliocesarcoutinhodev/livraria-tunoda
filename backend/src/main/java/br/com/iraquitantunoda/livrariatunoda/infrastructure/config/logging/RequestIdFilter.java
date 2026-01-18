package br.com.iraquitantunoda.livrariatunoda.infrastructure.config.logging;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

/**
 * Filtro para adicionar requestId ao MDC (Mapped Diagnostic Context).
 * O requestId permite rastrear todas as operacoes de uma requisicao nos logs.
 */
@Component
public class RequestIdFilter implements Filter {

    private static final String REQUEST_ID_HEADER = "X-Request-ID";
    private static final String MDC_REQUEST_ID_KEY = "requestId";

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;

        try {
            // Tenta obter requestId do header, senao gera um novo
            String requestId = httpRequest.getHeader(REQUEST_ID_HEADER);
            if (requestId == null || requestId.isBlank()) {
                requestId = UUID.randomUUID().toString();
            }

            // Adiciona ao MDC para estar disponivel em todos os logs
            MDC.put(MDC_REQUEST_ID_KEY, requestId);

            chain.doFilter(request, response);
        } finally {
            // Limpa o MDC ao final da requisicao
            MDC.clear();
        }
    }
}

