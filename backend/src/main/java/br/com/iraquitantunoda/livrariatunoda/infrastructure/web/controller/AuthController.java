package br.com.iraquitantunoda.livrariatunoda.infrastructure.web.controller;

import br.com.iraquitantunoda.livrariatunoda.application.dto.AuthenticationResponse;
import br.com.iraquitantunoda.livrariatunoda.application.dto.LoginRequest;
import br.com.iraquitantunoda.livrariatunoda.application.dto.RefreshTokenRequest;
import br.com.iraquitantunoda.livrariatunoda.application.dto.RevokeTokenRequest;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.LoginUseCase;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.RefreshTokenUseCase;
import br.com.iraquitantunoda.livrariatunoda.application.usecase.RevokeTokenUseCase;
import br.com.iraquitantunoda.livrariatunoda.infrastructure.service.CookieService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
 * Implementa autenticacao via cookies HttpOnly/Secure.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final LoginUseCase loginUseCase;
    private final RefreshTokenUseCase refreshTokenUseCase;
    private final RevokeTokenUseCase revokeTokenUseCase;
    private final CookieService cookieService;

    /**
     * Endpoint de login para usuarios administrativos.
     * Valida credenciais e retorna tokens JWT.
     * Tokens sao enviados via cookies HttpOnly/Secure e tambem no response body.
     *
     * @param request Credenciais de login (email e senha)
     * @param response Response HTTP para setar cookies
     * @return Tokens de autenticacao (access e refresh)
     */
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {
        var authResponse = loginUseCase.execute(request);

        // Seta cookies HttpOnly/Secure
        cookieService.setAccessTokenCookie(response, authResponse.accessToken());
        cookieService.setRefreshTokenCookie(response, authResponse.refreshToken());

        return ResponseEntity.ok(authResponse);
    }

    /**
     * Endpoint para renovacao de tokens.
     * Valida o refresh token atual e retorna novos tokens.
     * Implementa token rotation: o refresh token antigo e invalidado.
     * Token pode vir via cookie (preferencial) ou via body (compatibilidade).
     *
     * @param request Request contendo o refresh token atual (opcional se via cookie)
     * @param httpRequest Request HTTP para ler cookies
     * @param httpResponse Response HTTP para setar novos cookies
     * @return Novos tokens de autenticacao (access e refresh)
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthenticationResponse> refresh(
            @RequestBody(required = false) RefreshTokenRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        // Tenta ler refresh token do cookie primeiro, senao usa o body
        String refreshToken = cookieService.getRefreshToken(httpRequest)
            .orElseGet(() -> request != null ? request.refreshToken() : null);

        if (refreshToken == null) {
            throw new br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException(
                "Refresh token nao fornecido"
            );
        }

        var refreshRequest = new RefreshTokenRequest(refreshToken);
        var authResponse = refreshTokenUseCase.execute(refreshRequest);

        // Seta novos cookies HttpOnly/Secure
        cookieService.setAccessTokenCookie(httpResponse, authResponse.accessToken());
        cookieService.setRefreshTokenCookie(httpResponse, authResponse.refreshToken());

        return ResponseEntity.ok(authResponse);
    }

    /**
     * Endpoint para logout (revogacao de token).
     * Invalida o refresh token fornecido, impedindo renovacao futura.
     * O access token expira naturalmente (curta duracao).
     * Token pode vir via cookie (preferencial) ou via body (compatibilidade).
     *
     * Endpoint publico - nao requer autenticacao JWT.
     * Usuario envia o refresh token que deseja revogar.
     *
     * @param request Request contendo o refresh token a ser revogado (opcional se via cookie)
     * @param httpRequest Request HTTP para ler cookies
     * @param httpResponse Response HTTP para limpar cookies
     * @return 204 No Content
     */
    @PostMapping("/revoke")
    public ResponseEntity<Void> revoke(
            @RequestBody(required = false) RevokeTokenRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        // Tenta ler refresh token do cookie primeiro, senao usa o body
        String refreshToken = cookieService.getRefreshToken(httpRequest)
            .orElseGet(() -> request != null ? request.refreshToken() : null);

        if (refreshToken == null) {
            throw new br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException(
                "Refresh token nao fornecido"
            );
        }

        var revokeRequest = new RevokeTokenRequest(refreshToken);
        revokeTokenUseCase.execute(revokeRequest);

        // Limpa cookies de autenticacao
        cookieService.clearAllAuthCookies(httpResponse);

        return ResponseEntity.noContent().build();
    }

    /**
     * Endpoint para logout completo (revoga TODOS os tokens do usuario).
     * Util em casos de comprometimento de seguranca ou troca de senha.
     * Invalida todas as sessoes ativas do usuario.
     * Token pode vir via cookie (preferencial) ou via body (compatibilidade).
     *
     * Endpoint publico - nao requer autenticacao JWT.
     * Usuario envia qualquer refresh token valido para identificar-se.
     *
     * @param request Request contendo um refresh token do usuario (opcional se via cookie)
     * @param httpRequest Request HTTP para ler cookies
     * @param httpResponse Response HTTP para limpar cookies
     * @return 204 No Content
     */
    @PostMapping("/revoke-all")
    public ResponseEntity<Void> revokeAll(
            @RequestBody(required = false) RevokeTokenRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        // Tenta ler refresh token do cookie primeiro, senao usa o body
        String refreshToken = cookieService.getRefreshToken(httpRequest)
            .orElseGet(() -> request != null ? request.refreshToken() : null);

        if (refreshToken == null) {
            throw new br.com.iraquitantunoda.livrariatunoda.domain.exception.BusinessException(
                "Refresh token nao fornecido"
            );
        }

        var revokeRequest = new RevokeTokenRequest(refreshToken);
        revokeTokenUseCase.executeRevokeAll(revokeRequest);

        // Limpa cookies de autenticacao
        cookieService.clearAllAuthCookies(httpResponse);

        return ResponseEntity.noContent().build();
    }
}

