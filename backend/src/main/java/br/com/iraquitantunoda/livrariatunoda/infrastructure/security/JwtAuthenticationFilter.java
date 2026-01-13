package br.com.iraquitantunoda.livrariatunoda.infrastructure.security;

import br.com.iraquitantunoda.livrariatunoda.domain.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Filtro JWT que intercepta requisicoes e valida tokens de autenticacao.
 * Extrai informacoes do token e adiciona ao contexto de seguranca do Spring.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        // Se nao tem header Authorization, continua sem autenticar
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Extrai token do header
            final String jwt = authHeader.substring(7);

            // Valida token
            if (!jwtService.validateToken(jwt)) {
                log.warn("Token JWT invalido");
                filterChain.doFilter(request, response);
                return;
            }

            // Extrai informacoes do token
            var userId = jwtService.extractUserId(jwt);
            var role = jwtService.extractRole(jwt);

            // Se ja esta autenticado, nao precisa fazer nada
            if (SecurityContextHolder.getContext().getAuthentication() != null) {
                filterChain.doFilter(request, response);
                return;
            }

            // Cria authorities baseado no role
            var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));

            // Cria authentication token
            var authToken = new UsernamePasswordAuthenticationToken(
                userId,
                null,
                authorities
            );

            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            // Define no contexto de seguranca
            SecurityContextHolder.getContext().setAuthentication(authToken);

            log.debug("Usuario autenticado via JWT: {} (Role: {})", userId.getValue(), role);

        } catch (Exception e) {
            log.error("Erro ao processar token JWT: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}

