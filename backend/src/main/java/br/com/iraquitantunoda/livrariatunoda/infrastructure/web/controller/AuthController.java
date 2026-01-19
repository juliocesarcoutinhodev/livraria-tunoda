package br.com.iraquitantunoda.livrariatunoda.infrastructure.web.controller;

import br.com.iraquitantunoda.livrariatunoda.application.dto.AuthenticationResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.LoginRequest;
import br.com.iraquitantunoda.livrariatunoda.application.dto.RefreshTokenRequest;
import br.com.iraquitantunoda.livrariatunoda.application.dto.RevokeTokenRequest;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.LoginUseCase;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.RefreshTokenUseCase;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.RevokeTokenUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller para endpoints de autenticacao.
 * Permite login, renovacao de tokens e logout (revogacao).
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final LoginUseCase loginUseCase;
    private final RefreshTokenUseCase refreshTokenUseCase;
    private final RevokeTokenUseCase revokeTokenUseCase;

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

    /**
     * Endpoint para logout (revogacao de token).
     * Invalida o refresh token fornecido, impedindo renovacao futura.
     * O access token expira naturalmente (curta duracao).
     *
     * Endpoint publico - nao requer autenticacao JWT.
     * Usuario envia o refresh token que deseja revogar.
     *
     * @param request Request contendo o refresh token a ser revogado
     * @return 204 No Content
     */
    @PostMapping("/revoke")
    public ResponseEntity<Void> revoke(@Valid @RequestBody RevokeTokenRequest request) {
        revokeTokenUseCase.execute(request);
        return ResponseEntity.noContent().build();
    }

    /**
     * Endpoint para logout completo (revoga TODOS os tokens do usuario).
     * Util em casos de comprometimento de seguranca ou troca de senha.
     * Invalida todas as sessoes ativas do usuario.
     *
     * Endpoint publico - nao requer autenticacao JWT.
     * Usuario envia qualquer refresh token valido para identificar-se.
     *
     * @param request Request contendo um refresh token do usuario
     * @return 204 No Content
     */
    @PostMapping("/revoke-all")
    public ResponseEntity<Void> revokeAll(@Valid @RequestBody RevokeTokenRequest request) {
        revokeTokenUseCase.executeRevokeAll(request);
        return ResponseEntity.noContent().build();
    }
}

