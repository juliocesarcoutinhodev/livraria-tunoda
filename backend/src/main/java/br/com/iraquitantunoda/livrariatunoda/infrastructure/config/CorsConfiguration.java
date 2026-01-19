package br.com.iraquitantunoda.livrariatunoda.infrastructure.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

/**
 * Configuracao global de CORS (Cross-Origin Resource Sharing).
 * Centraliza todas as regras de acesso cross-origin em um unico ponto.
 *
 * IMPORTANTE: A partir de 2026-01-19, CORS e processado pelo CorsFilter customizado
 * que roda ANTES do Spring Security. Isso garante que respostas 401/403 tambem
 * tenham headers CORS corretos.
 *
 * Este WebMvcConfigurer foi DESABILITADO para evitar conflito com o CorsFilter.
 * Se precisar reverter, basta descomentar o implements e o metodo.
 *
 * Estrategia de seguranca:
 * - Deny by default: apenas origens explicitamente configuradas sao permitidas
 * - Metodos HTTP: apenas os necessarios para a API
 * - Headers: controle explicito de quais headers sao permitidos
 * - Credentials: configuravel por ambiente
 *
 * NAO usar @CrossOrigin em controllers - toda configuracao esta centralizada aqui.
 *
 * Configuracao por ambiente:
 * - Local: permissivo (localhost em varias portas)
 * - Staging: restrito a dominio de homologacao
 * - Production: apenas dominio de producao autorizado
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class CorsConfiguration /* implements WebMvcConfigurer */ {

    private final CorsProperties corsProperties;

    // DESABILITADO: CORS agora e processado pelo CorsFilter
    // @Override
    public void addCorsMappings_DISABLED(CorsRegistry registry) {
        log.info("Configurando CORS para origens: {}", corsProperties.getAllowedOrigins());

        registry.addMapping("/api/**")
                .allowedOrigins(corsProperties.getAllowedOrigins().toArray(new String[0]))
                .allowedMethods(corsProperties.getAllowedMethods().toArray(new String[0]))
                .allowedHeaders(corsProperties.getAllowedHeaders().toArray(new String[0]))
                .exposedHeaders(corsProperties.getExposedHeaders() != null
                    ? corsProperties.getExposedHeaders().toArray(new String[0])
                    : new String[0])
                .allowCredentials(corsProperties.getAllowCredentials() != null
                    ? corsProperties.getAllowCredentials()
                    : false)
                .maxAge(corsProperties.getMaxAge() != null
                    ? corsProperties.getMaxAge()
                    : 3600L);

        log.info("CORS configurado com sucesso - Metodos: {}, Credentials: {}",
                 corsProperties.getAllowedMethods(),
                 corsProperties.getAllowCredentials());
    }
}

