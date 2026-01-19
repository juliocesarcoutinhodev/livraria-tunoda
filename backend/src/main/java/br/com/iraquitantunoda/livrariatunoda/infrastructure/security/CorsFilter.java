package br.com.iraquitantunoda.livrariatunoda.infrastructure.security;

import br.com.iraquitantunoda.livrariatunoda.infrastructure.config.CorsProperties;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro CORS que processa headers ANTES de qualquer outro filtro.
 * Garante que respostas 401/403 tambem tenham headers CORS corretos.
 *
 * Order.HIGHEST_PRECEDENCE garante execucao antes do JwtAuthenticationFilter.
 *
 * Estrategia:
 * - Adiciona headers CORS em TODAS as respostas
 * - Permite preflight (OPTIONS) passar sem autenticacao
 * - Compativel com configuracao CorsProperties
 */
@Slf4j
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@RequiredArgsConstructor
public class CorsFilter extends OncePerRequestFilter {

    private final CorsProperties corsProperties;

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {

        String origin = request.getHeader("Origin");
        String method = request.getMethod();

        // Verifica se a origem esta permitida
        if (origin != null && isOriginAllowed(origin)) {
            // Headers CORS obrigatorios
            response.setHeader("Access-Control-Allow-Origin", origin);
            response.setHeader("Access-Control-Allow-Credentials",
                String.valueOf(corsProperties.getAllowCredentials() != null
                    ? corsProperties.getAllowCredentials()
                    : false));

            // Preflight (OPTIONS) - adiciona headers adicionais
            if ("OPTIONS".equalsIgnoreCase(method)) {
                response.setHeader("Access-Control-Allow-Methods",
                    String.join(",", corsProperties.getAllowedMethods()));
                response.setHeader("Access-Control-Allow-Headers",
                    String.join(",", corsProperties.getAllowedHeaders()));
                response.setHeader("Access-Control-Max-Age",
                    String.valueOf(corsProperties.getMaxAge() != null
                        ? corsProperties.getMaxAge()
                        : 3600));

                if (corsProperties.getExposedHeaders() != null && !corsProperties.getExposedHeaders().isEmpty()) {
                    response.setHeader("Access-Control-Expose-Headers",
                        String.join(",", corsProperties.getExposedHeaders()));
                }

                // Responde imediatamente o preflight
                response.setStatus(HttpServletResponse.SC_OK);
                return;
            }

            // Para requisicoes normais, adiciona exposed headers
            if (corsProperties.getExposedHeaders() != null && !corsProperties.getExposedHeaders().isEmpty()) {
                response.setHeader("Access-Control-Expose-Headers",
                    String.join(",", corsProperties.getExposedHeaders()));
            }
        }

        // Continua a cadeia de filtros
        filterChain.doFilter(request, response);
    }

    /**
     * Verifica se a origem esta na lista de origens permitidas.
     */
    private boolean isOriginAllowed(String origin) {
        return corsProperties.getAllowedOrigins().stream()
            .anyMatch(allowedOrigin ->
                allowedOrigin.equals("*") || allowedOrigin.equals(origin));
    }
}
