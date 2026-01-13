package br.com.iraquitantunoda.livrariatunoda.infrastructure.web.controller;

import br.com.iraquitantunoda.livrariatunoda.application.dto.CurrentUserResponse;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.GetCurrentUserUseCase;
import br.com.iraquitantunoda.livrariatunoda.domain.model.UserId;
import br.com.iraquitantunoda.livrariatunoda.domain.service.JwtService;
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
 */
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final GetCurrentUserUseCase getCurrentUserUseCase;
    private final JwtService jwtService;

    /**
     * Retorna dados do usuario autenticado.
     * Dados sao extraidos do token JWT, sem consulta ao banco.
     *
     * Endpoint protegido - requer header: Authorization: Bearer {token}
     *
     * @param authentication Contexto de autenticacao do Spring Security
     * @param authHeader Header Authorization com token JWT
     * @return Dados do usuario (id, email, role)
     */
    @GetMapping("/me")
    public ResponseEntity<CurrentUserResponse> getCurrentUser(
        Authentication authentication,
        @RequestHeader("Authorization") String authHeader
    ) {
        // Extrai userId do contexto de autenticacao
        var userId = (UserId) authentication.getPrincipal();

        // Extrai token do header
        var jwt = authHeader.substring(7);

        // Extrai email e role do token
        var email = jwtService.extractEmail(jwt);
        var role = jwtService.extractRole(jwt);

        var response = getCurrentUserUseCase.execute(userId, email, role);

        return ResponseEntity.ok(response);
    }
}

