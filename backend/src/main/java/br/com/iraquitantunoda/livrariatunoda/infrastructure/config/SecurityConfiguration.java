package br.com.iraquitantunoda.livrariatunoda.infrastructure.config;

import br.com.iraquitantunoda.livrariatunoda.infrastructure.security.CustomAccessDeniedHandler;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.security.CustomAuthenticationEntryPoint;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Configuracao de seguranca do Spring Security.
 * Centraliza todas as regras de autorizacao de endpoints.
 * Separacao clara entre rotas publicas, autenticadas e administrativas.
 *
 * Estrutura de seguranca:
 * - Rotas publicas: /api/auth/**, /api/public/**, /api/webhooks/**, /api/v1/actuator/**
 * - Rotas autenticadas: /api/user/**
 * - Rotas administrativas: /api/admin/** (requer ROLE_ADMIN)
 * - Outras rotas: /api/carts/**, /api/orders/**, /api/payments/**, /api/shipping/** (publicas por enquanto)
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomAuthenticationEntryPoint authenticationEntryPoint;
    private final CustomAccessDeniedHandler accessDeniedHandler;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                // Endpoints publicos - sem autenticacao necessaria
                .requestMatchers("/api/auth/**").permitAll()              // Login, refresh token
                .requestMatchers("/api/public/**").permitAll()            // Catalogo publico
                .requestMatchers("/api/webhooks/**").permitAll()          // Webhooks Mercado Pago
                .requestMatchers("/api/v1/actuator/**").permitAll()       // Health check

                // Endpoints administrativos - requer ROLE_ADMIN
                .requestMatchers("/api/admin/**").hasRole("ADMIN")        // CRUD autores e livros

                // Endpoints autenticados - requer token valido
                .requestMatchers("/api/user/**").authenticated()          // Dados do usuario autenticado

                // Endpoints de carrinho, pedidos, pagamentos e frete
                // Publicos por enquanto - podem ser protegidos futuramente
                .requestMatchers("/api/carts/**").permitAll()             // Carrinho de compras
                .requestMatchers("/api/orders/**").permitAll()            // Pedidos
                .requestMatchers("/api/payments/**").permitAll()          // Pagamentos
                .requestMatchers("/api/shipping/**").permitAll()          // Calculo de frete

                // Qualquer outro endpoint - negado por padrao (seguranca)
                .anyRequest().denyAll()
            )
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint(authenticationEntryPoint)       // 401 Unauthorized
                .accessDeniedHandler(accessDeniedHandler)                 // 403 Forbidden
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

