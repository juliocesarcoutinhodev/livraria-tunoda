package br.com.iraquitantunoda.livrariatunoda.infrastructure.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.actuate.autoconfigure.security.servlet.EndpointRequest;
import org.springframework.boot.actuate.health.HealthEndpoint;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Configuracao de seguranca especifica para endpoints do Actuator.
 * Aplica regras diferentes por profile:
 *
 * - Local/Dev: Todos endpoints liberados (permitAll)
 * - Staging: Health publico, demais endpoints requerem autenticacao
 * - Producao: Health publico, demais endpoints requerem ROLE_ADMIN
 *
 * Order(1) garante que esta configuracao tem precedencia sobre SecurityConfiguration.
 */
@Slf4j
@Configuration
public class ActuatorSecurityConfiguration {

    /**
     * Configuracao para ambientes de desenvolvimento (local, dev).
     * Todos os endpoints do Actuator sao publicos.
     */
    @Bean
    @Order(1)
    @Profile({"local", "dev"})
    public SecurityFilterChain actuatorSecurityFilterChainDev(HttpSecurity http) throws Exception {
        log.info("Configurando seguranca do Actuator para ambiente de desenvolvimento (permitAll)");

        http
            .securityMatcher("/api/v1/actuator/**")
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            );

        return http.build();
    }

    /**
     * Configuracao para ambiente de staging.
     * Health publico, demais endpoints requerem autenticacao.
     */
    @Bean
    @Order(1)
    @Profile("staging")
    public SecurityFilterChain actuatorSecurityFilterChainStaging(HttpSecurity http) throws Exception {
        log.info("Configurando seguranca do Actuator para staging (health publico, demais autenticados)");

        http
            .securityMatcher("/api/v1/actuator/**")
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(EndpointRequest.to(HealthEndpoint.class)).permitAll()
                .anyRequest().authenticated()
            );

        return http.build();
    }

    /**
     * Configuracao para ambiente de producao.
     * Health publico, demais endpoints requerem ROLE_ADMIN.
     */
    @Bean
    @Order(1)
    @Profile("prod")
    public SecurityFilterChain actuatorSecurityFilterChainProd(HttpSecurity http) throws Exception {
        log.info("Configurando seguranca do Actuator para producao (health publico, demais ADMIN apenas)");

        http
            .securityMatcher("/api/v1/actuator/**")
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(EndpointRequest.to(HealthEndpoint.class)).permitAll()
                .anyRequest().hasRole("ADMIN")
            );

        return http.build();
    }
}

