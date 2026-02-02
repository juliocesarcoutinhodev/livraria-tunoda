package br.com.iraquitantunoda.livrariatunoda.infrastructure.web.controller;

import br.com.iraquitantunoda.livrariatunoda.application.dto.CurrentUserResponse;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.GetCurrentUserUseCase;
import br.com.iraquitantunoda.livrariatunoda.domain.model.UserId;
import br.com.iraquitantunoda.livrariatunoda.domain.service.JwtService;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.service.CookieService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller para endpoints do usuario autenticado.
 * Endpoints protegidos que requerem autenticacao JWT.
 * Token pode vir via cookie (__Secure-at) ou header Authorization.
 */
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final GetCurrentUserUseCase getCurrentUserUseCase;
    private final JwtService jwtService;
    private final CookieService cookieService;

    /**
     * Retorna dados do usuario autenticado.
     * Dados sao extraidos do token JWT, sem consulta ao banco.
     * Token pode vir via cookie (__Secure-at) ou header Authorization: Bearer.
     *
     * Endpoint protegido - requer autenticacao JWT (via cookie ou header)
     *
     * @param authentication Contexto de autenticacao do Spring Security
     * @param authHeader Header Authorization com token JWT (opcional se cookie presente)
     * @param request Request HTTP para ler cookie
     * @return Dados do usuario (id, email, role)
     */
    @GetMapping("/me")
    public ResponseEntity<CurrentUserResponse> getCurrentUser(
        Authentication authentication,
        @RequestHeader(value = "Authorization", required = false) String authHeader,
        HttpServletRequest request
    ) {
        // Extrai userId do contexto de autenticacao (ja validado pelo JwtAuthenticationFilter)
        var userId = (UserId) authentication.getPrincipal();

        // Tenta extrair token do header Authorization primeiro
        String jwt = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
        }

        // Se nao tem no header, tenta extrair do cookie
        if (jwt == null) {
            jwt = cookieService.getAccessToken(request).orElse(null);
        }

        // Se ainda nao tem token, erro (nao deveria acontecer pois passou pelo filtro)
        if (jwt == null) {
            throw new br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException(
                "Token nao encontrado"
            );
        }

        // Extrai email e role do token
        var email = jwtService.extractEmail(jwt);
        var role = jwtService.extractRole(jwt);

        var response = getCurrentUserUseCase.execute(userId, email, role);

        return ResponseEntity.ok(response);
    }
}

