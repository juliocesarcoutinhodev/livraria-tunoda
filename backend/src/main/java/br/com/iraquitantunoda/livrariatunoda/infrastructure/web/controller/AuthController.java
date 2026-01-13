package br.com.iraquitantunoda.livrariatunoda.infrastructure.web.controller;

import br.com.iraquitantunoda.livrariatunoda.application.dto.AuthenticationResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.LoginRequest;
import br.com.iraquitantunoda.livrariatunoda.application.dto.RefreshTokenRequest;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.LoginUseCase;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.RefreshTokenUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller para endpoints de autenticacao.
 * Permite login e renovacao de tokens de usuarios administrativos.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final LoginUseCase loginUseCase;
    private final RefreshTokenUseCase refreshTokenUseCase;

    /**
     * Endpoint de login para usuarios administrativos.
     * Valida credenciais e retorna tokens JWT.
     *
     * @param request Credenciais de login (email e senha)
     * @return Tokens de autenticacao (access e refresh)
     */
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@Valid @RequestBody LoginRequest request) {
        var response = loginUseCase.execute(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para renovacao de tokens.
     * Valida o refresh token atual e retorna novos tokens.
     * Implementa token rotation: o refresh token antigo e invalidado.
     *
     * @param request Request contendo o refresh token atual
     * @return Novos tokens de autenticacao (access e refresh)
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthenticationResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        var response = refreshTokenUseCase.execute(request);
        return ResponseEntity.ok(response);
    }
}

